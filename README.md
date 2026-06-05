# 🚀 PRESTART: The Operating System for Founders

PRESTART is a premium, high-fidelity React Single-Page Application (SPA) designed to act as an interactive **AI Co-Founder**. It helps founders convert vague startup ideas into highly structured, actionable execution workspaces—mapping out development roadmaps, engineering backlogs, competitor price matrices, and strategic growth guidelines in real time.

Powered by the **Groq API** (`llama-3.3-70b-versatile` model in structured JSON mode), the application dynamically analyzes startup ideas, queries the user with clarifying throwback questions when concepts are too vague, and provides a context-aware chat advisor.

---

## 🎨 Premium UI/UX & Design System

Inspired by the clean, minimal, and premium dark-mode aesthetics of **Linear, Stripe, and Vercel**.

*   **harmonious Palette**:
    *   **Background**: `#0A0A0A` (Deepest Charcoal)
    *   **Cards**: `#111111` (Rich Dark Gray with hover highlight `#161616`)
    *   **Borders**: `#1A1A1A` (Subtle micro-lines)
    *   **Accent**: `#7C3AED` (Electric Violet)
*   **Typography**: Using premium sans-serif typography (`Outfit` for headings and `Inter` for highly readable body text) imported from Google Fonts.
*   **Aesthetics & Micro-animations**: Subtle linear grid background overlays, floating glowing mesh radial backdrops, smooth scale transforms on card hover, glassmorphism filters, and custom violet scrollbars.

---

## ⚙️ Core Technical Features

### 1. Interactive Onboarding & Concept Definition
*   **Startup Metadata**: Capture name, description, timeline, team size, stage, and **Target Customer** cohort.
*   **"Throwback" Questionnaire Wizard**: If you input a vague startup concept (e.g., *"I want to sell eyedrops"*), PRESTART pauses the loader and prompts you with **2-3 AI-generated clarifying questions** (e.g., target customer, chemical packaging, e-commerce channels) before compiling the plan.

### 2. Physical vs. Software Classification
The AI generation pipeline carefully distinguishes between digital tech apps and physical/medical/hardware consumer goods:
*   **Software SaaS**: Generates tasks for database schemas, auth code, frontend routes, and deployment pipelines.
*   **Physical Goods**: Focuses on raw ingredient formulations, sourcing raw materials, manufacturer contracts, FDA/regulatory compliance checks, and direct-to-consumer (DTC) COGS calculations.

### 3. Live AI Workspace Generator & Console
*   **AI Roadmap**: A 4-stage development and commercial timeline.
*   **AI Task Manager**: A drag-and-drop Kanban backlog. Shift task statuses between *To Do*, *In Progress*, and *Completed* via drag-and-drop or quick-action move arrows (`◀`, `▶`). Add, edit, or delete items on the fly.
*   **Competitor Matrix**: Breakdown of 3 direct/indirect competitors, strengths, pricing models, and market opportunities.
*   **Startup Health Score**: Calculated dynamically based on user retention, revenue, and velocity ranges. Retrieves targeted co-founder recommendations addressing your lowest metrics.
*   **AI Co-Founder Recommendations**: A dedicated tactical advice card directly tailored to your target customer cohort and concept.
*   **AI Co-Founder Chatbot**: A floating assistant loaded with the context of your generated roadmap, team metrics, and competitors, responding to custom queries in real time.

---

## 📂 Project Structure

```text
PRESTART/
├── .env                  # Secure environment variables (gitignored)
├── index.html            # Main HTML mounting entry (SEO-optimized tags)
├── package.json          # Vite & React dependency scripts
├── vite.config.js        # Vite configurations
├── src/
│   ├── main.jsx          # React DOM mounting script
│   ├── App.jsx           # App orchestrator, Groq API config, and loading overlays
│   ├── index.css         # Consolidated design system stylesheet & global animation classes
│   └── components/
│       ├── LandingView.jsx   # Landing page views (scroll reveals, pipeline cards, demo mockup)
│       ├── BuilderView.jsx   # Startup constructor form & throwback questions wizard
│       └── WorkspaceView.jsx # Dashboard console, Kanban boards, SVG meters, & live AI Chat
```

---

Developed by **Shriyan Kogta**
*   **GitHub**: [@Shriyan125](https://github.com/Shriyan125)
