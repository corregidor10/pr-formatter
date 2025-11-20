# PR Link Formatter

A simple React application built with TypeScript and Vite that formats Azure DevOps pull request links for easy copying to Teams.

## Features

- Paste an Azure DevOps PR link
- Automatically formats it as a clickable hyperlink "PR {number} {repo name}" for Teams
- Copy the markdown-formatted link to clipboard with one click

## Example

Input: `https://dev.azure.com/Accem/PLANEA/_git/Accem.Planea.Notifications/pullrequest/796`

Output (copied as markdown): `[PR 796 Notificaciones](https://dev.azure.com/Accem/PLANEA/_git/Accem.Planea.Notifications/pullrequest/796)`

Pastes in Teams as a clickable link.

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
