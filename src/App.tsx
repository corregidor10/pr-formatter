import { useState } from 'react'
import './App.css'

function App() {
  const [prLinks, setPrLinks] = useState('')
  const [formattedLinks, setFormattedLinks] = useState<string[]>([])
  const [copyButtonText, setCopyButtonText] = useState('Copy All')

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const links = e.target.value
    setPrLinks(links)
    const linkArray = links.split('\n').map(l => l.trim()).filter(l => l)
    const formatted = linkArray.map(formatPr).filter(f => f)
    setFormattedLinks(formatted)
  }

  const copyToClipboard = async () => {
    if (formattedLinks.length > 0 && prLinks) {
      try {
        const linkArray = prLinks.split('\n').map(l => l.trim()).filter(l => l)
        const hyperlinkText = formattedLinks.map((f, i) => `[${f}](${linkArray[i]})`).join('\n')
        const hyperlinkHtml = formattedLinks.map((f, i) => `<p><a href="${linkArray[i]}">${f}</a></p>`).join('')
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([hyperlinkText], { type: 'text/plain' }),
            'text/html': new Blob([hyperlinkHtml], { type: 'text/html' }),
          }),
        ]);
        setCopyButtonText('Copied!')
        setTimeout(() => setCopyButtonText('Copy All'), 2000)
      } catch (e) {
        setCopyButtonText('Failed')
        setTimeout(() => setCopyButtonText('Copy All'), 2000)
      }
    }
  }

  return (
    <div className="app">
      <h1>PR Link Formatter</h1>
      <textarea
        value={prLinks}
        onChange={handleInputChange}
        placeholder="Paste PR links here (one per line)"
        className="pr-input"
        rows={5}
      />
      {formattedLinks.length > 0 && (
        <div className="formatted">
          <h2>Formatted Links:</h2>
          <ul>
            {formattedLinks.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <button onClick={copyToClipboard} disabled={copyButtonText === 'Copied!' || copyButtonText === 'Failed'}>{copyButtonText}</button>
        </div>
      )}
    </div>
  )
}

export default App
