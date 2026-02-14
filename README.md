# Outside Context Protocol

A matter simulator for trainee solicitors. Built with Next.js, TypeScript, and the Anthropic Claude API.

Outside Context Protocol generates realistic legal training exercises from real matter documents. Supervising solicitors upload source materials and ideal outputs, and the platform creates structured, multi-step simulations that trainees work through — with AI-powered grading, feedback, and a virtual supervisor to ask questions.

## What it does

**For supervisors:**
- Upload matter documents (PDFs, Word files, plain text)
- AI generates a structured training exercise with multiple steps
- Each step has grading criteria, ideal outputs, and scoring
- Review trainee performance with detailed reports

**For trainees:**
- Work through realistic matter simulations step by step
- Read briefing documents, draft responses, review materials
- Ask the virtual supervisor questions (AI assesses question quality)
- Receive detailed grading with strengths, improvements, and critical issues
- Go back and resubmit earlier steps

**Step types:** read, draft, email, review, identify, advise

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/KilgoreHerring/OutsideContextProtocol.git
   cd OutsideContextProtocol
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add your API key**

   Create a `.env.local` file in the project root:

   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

### First run

On first launch you'll see a role picker — choose **Supervisor** to create exercises or **Trainee** to work through them.

A selection of prebuilt exercises are included so trainees have something to try immediately.

To create your own exercise as a supervisor:
1. Click **+ New Exercise**
2. Fill in the title, matter type, and estimated duration
3. Upload source documents (what the trainee will see) and ideal outputs (the benchmark for grading)
4. Click **Generate** — the AI will create the exercise steps, rubric, and briefing narrative

## How it works

- **Exercise generation** — Claude analyses your uploaded documents and creates a multi-step exercise with grading criteria
- **Grading** — Trainee submissions are compared against ideal outputs using Claude, with scores clamped to defined bounds
- **Chat** — Trainees can ask a virtual supervisor questions during the exercise; the AI stays in character and avoids giving away answers
- **Final report** — On completion, Claude writes a narrative assessment of the trainee's overall performance

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **AI:** Anthropic Claude API (Sonnet)
- **Storage:** Local filesystem (`data/` directory)
- **Document parsing:** pdf-parse, mammoth (DOCX)
- **Styling:** Plain CSS

## Project structure

```
src/
  app/                    # Next.js pages and API routes
    api/                  # REST endpoints (exercises, sessions, documents)
    exercises/            # Exercise list, detail, and creation pages
    simulate/             # Training simulation workspace
  lib/
    ai/                   # Claude API integration (grading, chat, generation)
    documents/            # PDF and DOCX parsing
    storage/              # Filesystem-based data persistence
  types/                  # TypeScript type definitions
```

## Notes

- Storage is filesystem-based (`data/` folder) — works locally and on platforms with persistent disk. For serverless deployment you'd need to swap to a database.
- The `data/` directory is gitignored. Exercise and session data is created at runtime.
- Prebuilt seed exercises are generated on first run if no exercises exist.
