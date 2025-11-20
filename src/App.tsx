import { useState } from 'react'
import './App.css'

function App() {
  const [prLink, setPrLink] = useState('')
  const [formatted, setFormatted] = useState('')

  const formatPr = (link: string) => {
    try {
      const url = new URL(link)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    setPrLink(link)
    setFormatted(formatPr(link))
  }

  const copyToClipboard = async () => {
    if (formatted && prLink) {
      try {
        const hyperlink = `[${formatted}](${prLink})`
        await navigator.clipboard.writeText(hyperlink)
        alert('Copied hyperlink to clipboard!')
      } catch (e) {
        alert('Failed to copy')
      }
    }
  }

  return (
    <div className="app">
      <h1>PR Link Formatter</h1>
      <input
        type="text"
        value={prLink}
        onChange={handleInputChange}
        placeholder="Paste PR link here"
        className="pr-input"
      />
      {formatted && (
        <div className="formatted">
          <p>Formatted: {formatted}</p>
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      )}
    </div>
  )
}

export default App
