import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import LandingView from './components/LandingView';
import BuilderView from './components/BuilderView';
import WorkspaceView from './components/WorkspaceView';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'builder' | 'workspace'
  const [loaderStep, setLoaderStep] = useState(0); // 0 (inactive), 1-5 (active steps)
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [pendingFormData, setPendingFormData] = useState(null);

  const [startupData, setStartupData] = useState({
    name: "",
    idea: "",
    targetCustomer: "",
    stage: "Idea",
    teamSize: "Solo Founder",
    timeline: "3 Months",
    metrics: {
      users: 75,
      revenue: 65,
      retention: 85,
      growth: 70,
      velocity: 90
    },
    competitors: [],
    roadmap: [],
    tasks: [],
    recommendations: []
  });

  // Helper function to query the Groq Chat Completion API
  const queryGroq = async (systemPrompt, userPrompt) => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Failed request");
      }
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Groq API error:", e);
      throw e;
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 1: ANALYZE AND DETECT CLARIFYING QUESTIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleBuilderSubmit = async (formData) => {
    setLoaderStep(1); // Visual cue: Analyzing concept scope
    setPendingFormData(formData);

    try {
      const analysisPrompt = `You are a expert startup venture partner. Analyze the user's startup concept.
      If the description is too short, vague, or lacks crucial details (such as who the target customer is, how the product physically/digitally works, the pricing method, or regulatory/formulation concerns) to generate a customized execution roadmap, output 2 to 3 direct, clarifying throwback questions.
      If the startup concept is detailed, clear, and actionable enough to generate a roadmap immediately, output an empty list.

      Return JSON in this format:
      {
        "clarifyingQuestions": ["Question 1", "Question 2"]
      }`;

      const analysisResult = await queryGroq(analysisPrompt, `Startup Name: ${formData.name}\nStartup Concept: ${formData.idea}\nTarget Customer: ${formData.targetCustomer}`);
      
      const questions = analysisResult.clarifyingQuestions || [];

      if (questions.length > 0) {
        // Pause loader, set questions, which will prompt BuilderView to show the Questionnaire Wizard
        setLoaderStep(0);
        setClarifyingQuestions(questions);
      } else {
        // Idea is clear, generate the roadmap directly
        await generateFullPlan(formData, "");
      }
    } catch (err) {
      console.error("Analysis step failed, falling back to direct roadmap generation", err);
      // Fallback: Try generating directly in case of analysis schema error
      await generateFullPlan(formData, "");
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 2: GENERATE WORKSPACE CONTEXT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const generateFullPlan = async (formData, clarificationsText) => {
    setLoaderStep(2); // Progress to: Drafting strategic roadmap

    const userPrompt = `
      Startup Name: ${formData.name}
      Current Stage: ${formData.stage}
      Target Timeline: ${formData.timeline}
      Team Size: ${formData.teamSize}
      Target Customer: ${formData.targetCustomer}
      Startup Idea: ${formData.idea}
      ${clarificationsText ? `\nClarifying Details Provided:\n${clarificationsText}` : ""}
    `;

    const systemPrompt = `You are an AI Co-Founder. Based on the startup metadata and idea (plus any answers to clarifying questions), generate a highly specific, customized, and realistic execution plan.
    
    CRITICAL: You must carefully distinguish between Software SaaS startups and Physical / Biotech / Medical / Hardware / Consumer Goods startups.
    - If it is a Physical/Medical product (like eyedrops, supplements, clothing, food, wellness devices): Milestones and tasks MUST focus on raw formulations, sourcing raw materials, manufacturer contracts, FDA/regulatory licensing audits, e-commerce direct-to-consumer (DTC) setups, and calculating Cost of Goods Sold (COGS). Do NOT generate database schemas, coding MVPs, or server deploy tasks for physical goods.
    - If it is a software/SaaS app: Generate software roadmap priorities (databases, code MVP modules, user authentication, stagings, beta metrics, API connections).

    Return JSON in exactly this format:
    {
      "competitors": [
        { "name": "Competitor Name 1", "price": "$XX/mo or $XX/unit", "strengths": "...", "weaknesses": "...", "opportunities": "..." },
        { "name": "Competitor Name 2", "price": "...", "strengths": "...", "weaknesses": "...", "opportunities": "..." },
        { "name": "Competitor Name 3", "price": "...", "strengths": "...", "weaknesses": "...", "opportunities": "..." }
      ],
      "roadmap": [
        { "phase": "Phase 1: Validation", "title": "...", "time": "Month 1", "desc": "Detailed milestone focus description" },
        { "phase": "Phase 2: Alpha", "title": "...", "time": "Month 2", "desc": "Detailed milestone focus description" },
        { "phase": "Phase 3: Beta Test", "title": "...", "time": "Month 3", "desc": "Detailed milestone focus description" },
        { "phase": "Phase 4: Launch", "title": "...", "time": "Month 4+", "desc": "Detailed milestone focus description" }
      ],
      "tasks": [
        { "id": "t1", "title": "Task title...", "status": "todo", "priority": "High" },
        { "id": "t2", "title": "Task title...", "status": "todo", "priority": "Medium" },
        { "id": "t3", "title": "Task title...", "status": "progress", "priority": "High" },
        { "id": "t4", "title": "Task title...", "status": "progress", "priority": "High" },
        { "id": "t5", "title": "Task title...", "status": "completed", "priority": "Low" },
        { "id": "t6", "title": "Task title...", "status": "completed", "priority": "Low" },
        { "id": "t7", "title": "Task title...", "status": "todo", "priority": "Medium" }
      ],
      "metrics": {
        "users": 15,
        "revenue": 5,
        "retention": 25,
        "growth": 15,
        "velocity": 80
      },
      "recommendations": [
        "First specific tactical recommendation tailored to their concept and target customer...",
        "Second specific tactical recommendation tailored to their concept and target customer...",
        "Third specific tactical recommendation tailored to their concept and target customer..."
      ]
    }
    Fill out all fields with high quality, specific content. Ensure all tasks and recommendations are highly actionable.
    CRITICAL: The values inside the "metrics" object (users, revenue, retention, growth, velocity) MUST be integers between 0 and 100 representing percentage health scores (NOT raw values like $10,000 or 5,000 users).`;

    try {
      const generatedPlan = await queryGroq(systemPrompt, userPrompt);
      
      // Step-by-step progress simulation ticks to load the workspace smoothly
      setLoaderStep(3); // Formulating engineering tasks
      setTimeout(() => {
        setLoaderStep(4); // Identifying key competitor gaps
        setTimeout(() => {
          setLoaderStep(5); // Setting up health score velocity
          setTimeout(() => {
            // Apply generated workspace
            setStartupData({
              ...formData,
              metrics: generatedPlan.metrics || { users: 15, revenue: 5, retention: 25, growth: 15, velocity: 80 },
              competitors: generatedPlan.competitors || [],
              roadmap: generatedPlan.roadmap || [],
              tasks: generatedPlan.tasks || [],
              recommendations: generatedPlan.recommendations || []
            });

            // Transition
            setLoaderStep(0);
            setClarifyingQuestions([]);
            setView('workspace');
            window.scrollTo(0, 0);
          }, 500);
        }, 500);
      }, 500);

    } catch (err) {
      console.error("Workspace generation failed, compiling default backup pack", err);
      // Fallback simulation in case of API failure
      compileFallbackPlan(formData);
    }
  };

  const handleAnswersSubmit = async (answers) => {
    setLoaderStep(2); // Resume loaders
    
    // Format clarifications text
    const clarificationsText = Object.entries(answers)
      .map(([q, a]) => `- Q: ${q}\n  A: ${a}`)
      .join('\n');

    await generateFullPlan(pendingFormData, clarificationsText);
  };

  // Fallback simulator in case of API errors or key issues
  const compileFallbackPlan = (formData) => {
    const defaultCompetitors = [
      { name: "SaaSify Core", price: "$29/mo", strengths: "Fast onboarding templates", weaknesses: "Low customizability", opportunities: "Deliver modular micro-applications" },
      { name: "FlowRunner", price: "$19/mo", strengths: "Clean layout, low cost entry", weaknesses: "Poor API integration webhooks", opportunities: "Build custom widgets that map specific actions" },
      { name: "CoreScale Studio", price: "$79/mo", strengths: "Robust analytics, enterprise logs", weaknesses: "Heavy interface, steep learning curve", opportunities: "Deliver a streamlined dashboard" }
    ];
    const defaultRoadmap = [
      { phase: "Phase 1: Validation", title: "Idea Validation & Scope", time: "Month 1", desc: `Draft target personas for ${formData.name}. Speak with 10 target clients. Build landing page.` },
      { phase: "Phase 2: Alpha", title: "Core MVP Engineering", time: "Month 2", desc: `Develop database model, authentication layers, and the primary application module for ${formData.name}.` },
      { phase: "Phase 3: Beta Test", title: "Beta Launch & Metrics", time: "Month 3", desc: `Deploy ${formData.name} on Staging. Onboard first 30 beta testers. Implement telemetry logs.` },
      { phase: "Phase 4: Launch", title: "Growth & Scaling", time: "Month 4+", desc: `Plan Product Hunt launch. Scale paid users to 100.` }
    ];
    const defaultTasks = [
      { id: "t1", title: `Define user personas and primary problem statements for ${formData.name}`, status: "todo", priority: "High" },
      { id: "t2", title: `Draft basic wireframes & user journey flow maps for ${formData.name}`, status: "todo", priority: "Medium" },
      { id: "t3", title: `Build initial landing page highlighting key value proposition & sign-up forms`, status: "progress", priority: "High" },
      { id: "t4", title: `Set up database schema & authentication system configs`, status: "progress", priority: "High" },
      { id: "t5", title: `Competitor audit: Identify pricing models of ${defaultCompetitors[0].name}`, status: "completed", priority: "Low" },
      { id: "t6", title: `Define product naming and register domains`, status: "completed", priority: "Low" },
      { id: "t7", title: `Integrate analytics tracking code to trace landing page conversions`, status: "todo", priority: "Medium" }
    ];

    const defaultRecommendations = [
      `Validate the core value proposition of ${formData.name} by interviewing 10 potential customers within your target audience.`,
      `Design an MVP focusing strictly on the single most painful problem of your Target Customer: ${formData.targetCustomer || "your niche market"}.`,
      `Establish a landing page with a clear CTA to capture emails and measure conversion interest before writing complex code or manufacturing.`
    ];

    setStartupData({
      ...formData,
      metrics: { users: 20, revenue: 5, retention: 30, growth: 15, velocity: 80 },
      competitors: defaultCompetitors,
      roadmap: defaultRoadmap,
      tasks: defaultTasks,
      recommendations: defaultRecommendations
    });

    setLoaderStep(0);
    setClarifyingQuestions([]);
    setView('workspace');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Dynamic Grid Background Design */}
      <div className="grid-overlay"></div>
      <div className="bg-glows-container">
        <div className="radial-glow glow-top-right"></div>
        <div className="radial-glow glow-center-left"></div>
        <div className="radial-glow glow-bottom-right"></div>
      </div>

      {/* Main View Router */}
      {view === 'landing' && (
        <LandingView onNavigateToBuilder={() => setView('builder')} />
      )}

      {view === 'builder' && (
        <BuilderView
          onNavigateToLanding={(e) => {
            e.preventDefault();
            setView('landing');
          }}
          onSubmit={handleBuilderSubmit}
          clarifyingQuestions={clarifyingQuestions}
          onAnswersSubmit={handleAnswersSubmit}
        />
      )}

      {view === 'workspace' && (
        <WorkspaceView
          startupData={startupData}
          onNavigateToLanding={(e) => {
            e.preventDefault();
            setView('landing');
          }}
          groqApiKey={GROQ_API_KEY}
        />
      )}

      {/* Simulated AI Generative Loader Overlay */}
      {loaderStep > 0 && (
        <div id="generation-loader" className="loader-overlay active">
          <div className="loader-content">
            <div className="loader-spinner-container">
              <div className="loader-ring"></div>
              <div className="loader-glow"></div>
            </div>
            <h3 className="loader-title text-gradient">
              {loaderStep === 1 ? "Analyzing Startup Concept" : "Generating Custom Plan"}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>
              {loaderStep === 1 
                ? "Connecting with AI Co-founder to inspect scope details..." 
                : "Structuring mission control workspace details..."}
            </p>
            <ul className="loader-steps">
              <li className={`loader-step-item ${loaderStep === 1 ? 'active' : loaderStep > 1 ? 'done' : 'pending'}`}>
                Analyzing concept scope
              </li>
              <li className={`loader-step-item ${loaderStep === 2 ? 'active' : loaderStep > 2 ? 'done' : 'pending'}`}>
                Drafting strategic roadmap
              </li>
              <li className={`loader-step-item ${loaderStep === 3 ? 'active' : loaderStep > 3 ? 'done' : 'pending'}`}>
                Formulating engineering tasks
              </li>
              <li className={`loader-step-item ${loaderStep === 4 ? 'active' : loaderStep > 4 ? 'done' : 'pending'}`}>
                Identifying key competitor gaps
              </li>
              <li className={`loader-step-item ${loaderStep === 5 ? 'active' : loaderStep > 5 ? 'done' : 'pending'}`}>
                Setting up health score velocity
              </li>
            </ul>
          </div>
        </div>
      )}
      <Analytics />
    </>
  );
}
