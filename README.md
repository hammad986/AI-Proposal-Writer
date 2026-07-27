# AI Proposal Writer

AI-powered project proposal generator for freelancers and agencies. Fill a four-step form, generate a complete professional proposal with scope, timeline, and pricing using Gemini AI, edit sections inline, and export the result as a PDF.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-6366f1)

## Screenshots

Add screenshots of the dashboard, multi-step form, generated proposal viewer, and PDF output here.

## Features

- ✅ Dashboard with proposal stats, values, statuses, and actions
- ✅ Four-step proposal form for basics, scope, pricing, and style
- ✅ Draft persistence with Zustand localStorage
- ✅ Gemini 1.5 Flash proposal generation API route
- ✅ Clean generating view with staged progress and retry support
- ✅ Inline section editing with saved-state badges
- ✅ Section regeneration from the proposal viewer
- ✅ Markdown-style table, list, text, and phase rendering
- ✅ PDF export with `@react-pdf/renderer`
- ✅ Dark mode-ready Tailwind design tokens

## Getting Started

```bash
git clone <repo-url>
cd ai-proposal-writer
npm install
cp .env.example .env.local
npm run dev
```

Set your Gemini API key in `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey).

## Netlify Deployment

This project is Netlify-ready as a standard Next.js app.

1. Connect the repository to Netlify.
2. Leave the build command as `npm run build`.
3. Set `GEMINI_API_KEY` in Netlify environment variables.
4. Use Node.js 20 for the build environment.

Required environment variables:

- `GEMINI_API_KEY`: Gemini API key used by the generation route.

Notes:

- The app uses Next.js App Router and an API route at `/api/generate`, which Netlify handles through its Next.js runtime.
- `netlify.toml` keeps the build command and Node version explicit so deployments are reproducible.

## How It Works

1. ✨ Add agency, client, and project basics
2. 🧭 Define scope, technical requirements, and target users
3. 💸 Choose complexity, budget, payment terms, and services
4. 📝 Select tone, language, and sections, then generate the proposal

## Live Demo

https://ai-proposal-writer-aetherion-labs.netlify.app/proposals 


## Acknowledgements

Special thanks to the BizBot team for their technical support and assistance.

**BizBot — AI fully automatically promotes your project**  
Official Website: http://bizbot.zvo.cn

---

Powered by Aetherion Labs
