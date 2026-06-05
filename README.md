# PRESTART: The Operating System for Founders

PRESTART is a premium, high-fidelity React Single-Page Application (SPA) designed to act as an AI Co-Founder. It helps founders transform vague startup ideas into highly structured, actionable execution workspaces—mapping out development roadmaps, engineering backlogs, competitor price matrices, and radial health indices in real time.

Powered by the **Groq Llama-3 API**, the application dynamically analyzes startup ideas, queries the user with clarifying throwback questions when concepts are too vague, and provides a context-aware chat advisor.

---

## 🎨 Design System & Aesthetics

Inspired by the clean, minimal, and premium dark-mode UIs of **Linear, Notion, Stripe, and Vercel**.

*   **Colors**:
    *   Background: `#0A0A0A` (Deepest Charcoal)
    *   Cards: `#111111` (Rich Dark Gray)
    *   Borders: `#1A1A1A` (Subtle micro-lines)
    *   Accent: `#7C3AED` (Electric Violet)
*   **Typography**: `Outfit` (for headings) and `Inter` (for readable body text).
*   **Visual Enhancements**: Subtle linear grid background overlays, floating glowing mesh radial backdrops, smooth scale transforms on card hover, glassmorphism filters, and custom violet scrollbars.

---

## ⚙️ Core Technical Features

### 1. Live AI Workspace Generator
Submitting your startup profiles queries the **Groq Llama-3-70b-versatile** model in structured JSON mode. It generates:
*   **AI Roadmap**: A 4-stage development and commercial timeline.
*   **AI Task Manager**: A 7-10 card engineering and marketing backlog.
*   **Competitor Matrix**: 3 direct/indirect competitors, strengths, pricing models, and market opportunities.
*   **Metrics Initialization**: Context-appropriate start values for customer acquisition, velocity, and revenue.

### 2. "Throwback" Questionnaire Wizard
If you input a vague startup concept (e.g., *"I want to sell eyedrops"*), PRESTART pauses the loader and prompts you with **2-3 AI-generated clarifying questions** (e.g., target customer, chemical packaging, e-commerce channels) before compiling the plan.

### 3. Physical vs. Software Classification
The AI generation pipeline distinguishes between digital tech apps (generating task lists for databases, auth code, and deployments) and physical/medical/hardware consumer goods (generating tasks for ingredient formulation safety, sourcing raw materials, manufacturer contracting, FDA compliance, and DTC COGS calculations).

### 4. Interactive Mission Control Dashboard
*   **Kanban Board**: Drag tasks or use quick-action move arrows (`◀`, `▶`) to shift statuses between *To Do*, *In Progress*, and *Completed*. Add, edit, or delete items on the fly.
*   **SVG Radial Health Score**: Calculates your index dynamically based on user retention, revenue, and execution speed range inputs. Animates the gauge and retrieves targeted co-founder recommendations addressing your lowest metrics.
*   **AI Co-Founder Chatbot**: A floating assistant loaded with the context of your generated roadmap and competitors, responding directly to custom queries or quick chip questions.

---

## 📂 Project Structure

```text
PRESTART/
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

## 🚀 Setup & Local Execution

### Prerequisites
*   Node.js (version 18 or higher recommended)
*   A Groq API key (configured directly inside [`src/App.jsx`](file:///Users/shriyankogta125/Desktop/Self Projects/PRESTART/src/App.jsx#L6))

### Installation
Clone the repository and install the Vite React package dependencies:
```bash
npm install
```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open the printed URL (usually `http://localhost:5173`) in your browser to interact with the live application.

### Building for Production
To compile and optimize the codebase into a production-ready bundle (`dist/` folder):
```bash
npm run build
```
The application compiles cleanly into lightweight asset files:
*   HTML: `~0.66 kB`
*   CSS: `~28.53 kB`
*   JS (React + libraries): `~243.42 kB`
