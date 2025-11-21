# PR Link Formatter

A simple React application built with TypeScript and Vite that formats Azure DevOps pull request links for easy copying to Teams.

## Features

- Paste multiple Azure DevOps PR links (one per line)
- Automatically formats each as a clickable hyperlink "PR {number} {repo name}" for Teams
- Copy all rich text hyperlinks to clipboard with one click (pastes as links in Teams desktop)

## Example

Input (multiple lines):
```
https://dev.azure.com/Accem/PLANEA/_git/Accem.Planea.Notifications/pullrequest/796
https://dev.azure.com/Accem/PLANEA/_git/Accem.Planea.API/pullrequest/123
```

Output: Copies rich text hyperlinks that paste in Teams as:
- PR 796 Notificaciones (clickable)
- PR 123 API (clickable)

## Getting Started

### Prerequisites

- Node.js (version 18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/corregidor10/pr-formatter.git
   cd pr-formatter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Deploy

The app is deployed to GitHub Pages. To deploy updates:

```bash
npm run deploy
```

Live app: [https://corregidor10.github.io/pr-formatter](https://corregidor10.github.io/pr-formatter)

## Technologies Used

- React 19
- TypeScript
- Vite
- GitHub Pages for deployment

## Testing & Compatibility

- Recommended browsers for best clipboard HTML behavior: **Chrome (Windows/Mac)**, **Edge (Windows)**. Teams Desktop on Windows works best when pasting HTML-rich clipboard content.
- Firefox and some mobile browsers may not support `text/html` clipboard writes; the app falls back to plain text in that case.
- If you encounter issues, try in an Incognito window to avoid cached assets.

## Local AI Prototype (optional)

This repository previously experimented with client-side AI generation using `t5-small`. That code was removed in favor of a deterministic message generator to keep the app lightweight and reliable. If you want to prototype AI locally, consider:

- Using `@xenova/transformers` (client-side) to run `t5-small` or other small models in the browser. Note: model download and inference may be slow and depends on device capabilities.
- Running a local inference server with `llama.cpp`/GGML and exposing a small REST endpoint. This approach requires downloading a quantized model and running it locally, but gives better performance and model choice.

## CI / Auto-deploy

- The project uses `gh-pages` for deployments. To enable automatic deploys on push, add a GitHub Action that runs `npm ci && npm run deploy` on pushes to `master`.

Example `workflow` snippet (add to `.github/workflows/deploy.yml`):

```yaml
name: Deploy
on:
   push:
      branches: [ master ]
jobs:
   deploy:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - name: Setup Node
            uses: actions/setup-node@v4
            with:
               node-version: 18
         - run: npm ci
         - run: npm run deploy
```

## Notes

- The app now generates a deterministic Teams message and copies rich HTML when the browser supports it. This guarantees predictable output and avoids external AI costs.
- If you want me to add automatic deployment via GitHub Actions, I can add the workflow file and commit it for you.
