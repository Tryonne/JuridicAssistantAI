# Project Requirements

This file lists prerequisites, dependencies, and install/run steps for the project.

## Prerequisites
- Node.js >= 18.18 (recommend 20 LTS)
- npm (bundled with Node)
- Azure OpenAI credentials (for the backend)

## Backend (API)
- Path: `JuridicChatAssitant/chat-assistant-be`

### Dependencies
- runtime:
  - express: ^5.1.0
  - cors: ^2.8.5
  - dotenv: ^17.2.1
  - openai: ^5.10.2
  - nodemon: ^3.1.10
- dev:
  - typescript: ^5.8.3
  - ts-node: ^10.9.2
  - @types/node: ^24.1.0
  - @types/express: ^5.0.3
  - @types/cors: ^2.8.19

### Environment
Create `JuridicChatAssitant/chat-assistant-be/.env` with:
```
AZURE_OPENAI_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-endpoint
# PORT=3000   # optional (defaults to 3000)
```

### Install
```
cd JuridicChatAssitant/chat-assistant-be
npm ci   # or: npm install
```

### Run (development)
```
npx ts-node src/app.ts
# or with reload
npx nodemon --exec ts-node src/app.ts
```

## Frontend (Next.js)
- Path: `JuridicChatAssitant/chat-assistant-fe`

### Dependencies
- runtime:
  - next: ^15.4.2-canary.23
  - react: 19.1.0
  - react-dom: 19.1.0
  - @icons-pack/react-simple-icons: ^13.6.0
  - @radix-ui/react-avatar: ^1.1.10
  - @radix-ui/react-collapsible: ^1.1.11
  - @radix-ui/react-dialog: ^1.1.14
  - @radix-ui/react-scroll-area: ^1.2.9
  - @radix-ui/react-select: ^2.2.5
  - @radix-ui/react-separator: ^1.1.7
  - @radix-ui/react-slot: ^1.2.3
  - @radix-ui/react-tooltip: ^1.2.7
  - @radix-ui/react-use-controllable-state: ^1.2.2
  - @shadcn/ui: ^0.0.4
  - @shikijs/transformers: ^3.8.1
  - class-variance-authority: ^0.7.1
  - clsx: ^2.1.1
  - lucide-react: ^0.525.0
  - react-markdown: ^10.1.0
  - remark-gfm: ^4.0.1
  - shadcn: ^2.9.2
  - shiki: ^3.8.1
  - tailwind-merge: ^3.3.1
  - use-stick-to-bottom: ^1.1.1
- dev:
  - typescript: 5.8.3
  - @types/node: ^20
  - @types/react: ^19
  - @types/react-dom: ^19
  - eslint: ^9
  - eslint-config-next: 15.4.2
  - tailwindcss: ^4
  - @tailwindcss/postcss: ^4
  - @eslint/eslintrc: ^3
  - tw-animate-css: ^1.3.5

### Install
```
cd JuridicChatAssitant/chat-assistant-fe
npm ci   # or: npm install
```

### Run (development)
Backend CORS is configured for `http://localhost:3001`. Run the frontend on port 3001:
```
npm run dev -- -p 3001
```

## Run Order
1) Start backend: `cd JuridicChatAssitant/chat-assistant-be && npx ts-node src/app.ts`
2) Start frontend: `cd JuridicChatAssitant/chat-assistant-fe && npm run dev -- -p 3001`

## Notes
- Prefer `npm ci` when `package-lock.json` is present for reproducible installs.
- Ensure Azure credentials are valid and the endpoint matches your Azure OpenAI resource.
