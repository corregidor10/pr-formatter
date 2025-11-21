import { useState } from 'react'
import './App.css'
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm'

function App() {
  const [links, setLinks] = useState<string[]>([''])
  const [comment, setComment] = useState('')
  const [formattedLinks, setFormattedLinks] = useState<string[]>([''])
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copyButtonText, setCopyButtonText] = useState('Copy Message')
  const [aiError, setAiError] = useState<string | null>(null)

  const formatPr = (link: string) => {
    try {
      const url = new URL(link.trim())
      const pathParts = url.pathname.split('/').filter(p => p)
      const gitIndex = pathParts.indexOf('_git')
      if (gitIndex !== -1 && pathParts[gitIndex + 2] === 'pullrequest') {
        const repo = pathParts[gitIndex + 1]
        const prId = pathParts[gitIndex + 3]
        const repoName = repo.split('.').pop() || repo
        return `PR ${prId} ${repoName}`
      }
    } catch (e) {
      // invalid URL
    }
    return ''
  }

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
    const newFormatted = [...formattedLinks]
    newFormatted[index] = formatPr(value)
    setFormattedLinks(newFormatted)
  }

  const addLink = () => {
    setLinks([...links, ''])
    setFormattedLinks([...formattedLinks, ''])
  }

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
      setFormattedLinks(formattedLinks.filter((_, i) => i !== index))
    }
  }

  const generateMessage = async () => {
    const validFormatted = formattedLinks.filter(f => f)
    if (validFormatted.length > 0) {
      setIsGenerating(true)
      setAiError(null)
      setGeneratedMessage('')
      try {
        const engine: MLCEngine = await CreateMLCEngine('RedPajama-INCITE-Chat-3B-v1-q4f16_1', {
          initProgressCallback: (progress) => console.log(progress)
        })
        const prList = validFormatted.join(', ')
        const prompt = `Generate a concise and professional Teams message summarizing these PR updates: ${prList}. Additional context: ${comment}\n\nMessage:`
        const reply = await engine.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200
        })
        setGeneratedMessage(reply.choices[0].message.content || '')
      } catch (error) {
        console.error(error)
        const errMsg = (error as any)?.message ?? String(error) ?? 'AI generation failed'
        setAiError(errMsg)

        // Fallback: build a markdown-style Teams-friendly message using the formatted PRs and the common comment
        const linkArray = links.map(l => l.trim()).filter(l => l)
        const fallbackLines = formattedLinks
          .map((f, i) => ({ f, url: linkArray[i] || '' }))
          .filter(x => x.f)
          .map(x => `- [${x.f}](${x.url || '#'})`)
        let fallback = 'PR updates:\n' + fallbackLines.join('\n')
        if (comment && comment.trim()) {
          fallback += '\n\nContext: ' + comment.trim()
        }
        setGeneratedMessage(fallback)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const copyMessage = async () => {
    if (generatedMessage) {
      try {
        // Try to write rich text (HTML) and plain text for best pasting into Teams desktop
        if (navigator.clipboard && (navigator.clipboard as any).write) {
          try {
            const linkArray = links.map(l => l.trim()).filter(l => l)
            const validFormatted = formattedLinks.filter(f => f)
            const html = validFormatted.map((f, i) => `<p><a href="${linkArray[i] || '#'}">${f}</a></p>`).join('')
            await (navigator.clipboard as any).write([
              new ClipboardItem({
                'text/plain': new Blob([generatedMessage], { type: 'text/plain' }),
                'text/html': new Blob([html], { type: 'text/html' }),
              }),
            ])
          } catch (inner) {
            // fallback to plain text if rich write fails
            await navigator.clipboard.writeText(generatedMessage)
          }
        } else {
          await navigator.clipboard.writeText(generatedMessage)
        }
        setCopyButtonText('Copied!')
        setTimeout(() => setCopyButtonText('Copy Message'), 2000)
      } catch (e) {
        setCopyButtonText('Failed')
        setTimeout(() => setCopyButtonText('Copy Message'), 2000)
      }
    }
  }

  return (
    <div className="app">
      <h1>PR Link Formatter</h1>
      {links.map((link, index) => (
        <div key={index} className="entry">
          <input
            type="text"
            placeholder="Paste PR link here"
            value={link}
            onChange={(e) => updateLink(index, e.target.value)}
            className="pr-input"
          />
          {formattedLinks[index] && <p>Formatted: {formattedLinks[index]}</p>}
          <button onClick={() => removeLink(index)} disabled={links.length === 1}>Remove</button>
        </div>
      ))}
      <button onClick={addLink} className="add-btn">Add Another PR</button>
      <textarea
        placeholder="Add a comment for all PRs (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="comment-input"
        rows={3}
      />
      <button onClick={generateMessage} disabled={isGenerating || !formattedLinks.some(f => f)}>
        {isGenerating ? 'Generating...' : 'Generate Teams Message'}
      </button>
      {generatedMessage && (
        <div className="generated">
          <h2>Generated Message:</h2>
          <textarea value={generatedMessage} readOnly className="message-output" rows={5} />
          <button onClick={copyMessage} disabled={copyButtonText === 'Copied!' || copyButtonText === 'Failed'}>{copyButtonText}</button>
        </div>
      )}
      {aiError && (
        <p className="error">AI generation failed: {aiError}. A fallback message was generated.</p>
      )}
    </div>
  )
}

export default App
