import React, { useEffect } from 'react';

export default function LandingView({ onNavigateToBuilder }) {
  useEffect(() => {
    // Setup intersection observer for scroll-triggered fades
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.pipeline-step, .solution-wrapper');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="view-landing" class="view active">
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="container nav-container">
          <a href="#" className="logo">
            <div className="logo-dot"></div>
            <span>PRESTART</span>
          </a>
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToElement('how-it-works'); }}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#problems" onClick={(e) => { e.preventDefault(); scrollToElement('problems'); }}>
                  Problem
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToElement('features'); }}>
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" onClick={(e) => { e.preventDefault(); scrollToElement('demo'); }}>
                  Demo
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <button className="btn btn-secondary btn-text" onClick={() => scrollToElement('demo')}>
              Watch Demo
            </button>
            <button className="btn btn-primary" onClick={onNavigateToBuilder}>
              Start Building
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-badge-container">
          <span className="badge">The Operating System for Founders</span>
        </div>
        <h1 className="text-gradient">
          Build Startups
          <br />
          Faster With AI
        </h1>
        <p>
          Transform ideas into roadmaps, tasks, market insights, and execution plans using your AI Co-Founder.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onNavigateToBuilder}>
            Start Building
          </button>
          <button className="btn btn-secondary" onClick={() => scrollToElement('demo')}>
            Watch Demo
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pipeline-section container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Process</span>
          <h2 className="section-title">The Startup Pipeline</h2>
          <p className="section-desc">
            From raw idea to launch, PreStart structures your entire workflow automatically.
          </p>
        </div>
        <div className="pipeline-wrapper">
          <div className="pipeline-line"></div>

          {/* Step 1 */}
          <div className="pipeline-step">
            <div className="pipeline-icon-circle">💡</div>
            <h4 className="pipeline-step-title">Startup Idea</h4>
            <p className="pipeline-step-desc">Enter your raw concept and target goals.</p>
          </div>

          {/* Step 2 */}
          <div className="pipeline-step" style={{ transitionDelay: '0.1s' }}>
            <div className="pipeline-icon-circle">🗺️</div>
            <h4 className="pipeline-step-title">AI Roadmap</h4>
            <p className="pipeline-step-desc">Receive a staged developmental timeline.</p>
          </div>

          {/* Step 3 */}
          <div className="pipeline-step" style={{ transitionDelay: '0.2s' }}>
            <div className="pipeline-icon-circle">📋</div>
            <h4 className="pipeline-step-title">Task Breakdown</h4>
            <p className="pipeline-step-desc">Tasks mapped into a fully structured Kanban board.</p>
          </div>

          {/* Step 4 */}
          <div className="pipeline-step" style={{ transitionDelay: '0.3s' }}>
            <div className="pipeline-icon-circle">🔍</div>
            <h4 className="pipeline-step-title">Competitor Analysis</h4>
            <p className="pipeline-step-desc">Analyze market landscape, pros, and cons.</p>
          </div>

          {/* Step 5 */}
          <div className="pipeline-step" style={{ transitionDelay: '0.4s' }}>
            <div className="pipeline-icon-circle">📈</div>
            <h4 className="pipeline-step-title">Health Tracking</h4>
            <p className="pipeline-step-desc">Track performance, speed, and validation risk.</p>
          </div>

          {/* Step 6 */}
          <div className="pipeline-step" style={{ transitionDelay: '0.5s' }}>
            <div className="pipeline-icon-circle">🚀</div>
            <h4 className="pipeline-step-title">Launch</h4>
            <p className="pipeline-step-desc">Execute clean releases and scale velocity.</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="problem-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">The Reality</span>
            <h2 className="section-title">Most Startups Don't Fail Because Of Bad Ideas</h2>
            <p className="section-desc">
              They fail because of poor execution. Knowing what to build and prioritize is the founder's
              bottleneck.
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="icon">❌</div>
              <h3>No Roadmap</h3>
            </div>
            <div className="problem-card">
              <div className="icon">❌</div>
              <h3>No Priorities</h3>
            </div>
            <div className="problem-card">
              <div className="icon">❌</div>
              <h3>No Validation</h3>
            </div>
            <div className="problem-card">
              <div className="icon">❌</div>
              <h3>No Competitor Awareness</h3>
            </div>
            <div className="problem-card">
              <div className="icon">❌</div>
              <h3>No Progress Tracking</h3>
            </div>
          </div>
          <div className="solution-wrapper">
            <div className="solution-banner">
              <h3>✅ PreStart solves all five.</h3>
              <p>Combining AI roadmap execution with a workspace dashboard to keep your startup organized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Features</span>
          <h2 className="section-title">Engineered For Execution</h2>
          <p className="section-desc">
            A premium toolset built explicitly to match founder needs, inspired by tools you love.
          </p>
        </div>
        <div className="features-grid">
          <div className="card card-glow feature-card">
            <div className="feature-icon-wrapper">🗺️</div>
            <h3>AI Roadmap Generator</h3>
            <p>
              Generate a realistic startup roadmap based on your idea, team size, and timeline constraints.
              Instantly stages phase priorities.
            </p>
          </div>
          <div className="card card-glow feature-card">
            <div className="feature-icon-wrapper">📋</div>
            <h3>AI Task Manager</h3>
            <p>
              Convert high-level product goals into individual engineering and marketing subtasks
              automatically. Backlog-ready.
            </p>
          </div>
          <div className="card card-glow feature-card">
            <div className="feature-icon-wrapper">🔍</div>
            <h3>Competitor Analyzer</h3>
            <p>
              Discover direct and indirect competitors, pricing structures, strengths, weaknesses, and clear
              market openings.
            </p>
          </div>
          <div className="card card-glow feature-card">
            <div className="feature-icon-wrapper">📈</div>
            <h3>Startup Health Score</h3>
            <p>
              Keep a regular pulse on your project. Get real-time health updates, risk warnings, and
              actionable recommendations.
            </p>
          </div>
          <div className="card card-glow feature-card feature-card-wide">
            <div className="feature-icon-wrapper">🤖</div>
            <h3>AI Founder Assistant</h3>
            <p>
              Your on-demand co-founder. Stuck on user acquisition? Unsure about pricing tiers? Tap the
              floating assistant for tactical guides tailored specifically to your company context.
            </p>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="demo-section container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Product Preview</span>
          <h2 className="section-title">See It In Action</h2>
          <p className="section-desc">
            Real-time structured roadmap output generated for an idea in under 5 seconds.
          </p>
        </div>

        <div className="demo-browser-mockup">
          <div className="demo-browser-header">
            <div className="demo-browser-dot"></div>
            <div className="demo-browser-dot"></div>
            <div className="demo-browser-dot"></div>
            <div className="demo-browser-address">prestart.ai/demo/ai-resume-analyzer</div>
          </div>
          <div className="demo-browser-content">
            <div className="demo-idea-box">
              <div>
                <div className="demo-idea-label">Startup Idea</div>
                <div className="demo-idea-text">AI Resume Analyzer</div>
              </div>
              <span className="badge">MVP Phase</span>
            </div>

            <div className="demo-output-roadmap">
              {/* Month 1 */}
              <div className="demo-month-card">
                <div className="demo-month-header">
                  <span>Month 1</span>
                  <span className="badge">Research</span>
                </div>
                <ul className="demo-month-list">
                  <li>User Research</li>
                  <li>Market Validation</li>
                  <li>Landing Page MVP</li>
                </ul>
              </div>
              {/* Month 2 */}
              <div className="demo-month-card">
                <div className="demo-month-header">
                  <span>Month 2</span>
                  <span className="badge">Build</span>
                </div>
                <ul className="demo-month-list">
                  <li>Build core MVP</li>
                  <li>Setup Authentication</li>
                  <li>File upload processing</li>
                </ul>
              </div>
              {/* Month 3 */}
              <div className="demo-month-card">
                <div className="demo-month-header">
                  <span>Month 3</span>
                  <span className="badge">Test</span>
                </div>
                <ul className="demo-month-list">
                  <li>Beta Launch</li>
                  <li>Collect Feedback</li>
                  <li>Iterate dashboard UX</li>
                </ul>
              </div>
              {/* Month 4 */}
              <div className="demo-month-card">
                <div className="demo-month-header">
                  <span>Month 4</span>
                  <span className="badge">Launch</span>
                </div>
                <ul className="demo-month-list">
                  <li>First 100 Users</li>
                  <li>Product Hunt Release</li>
                  <li>Introduce Pricing Tiers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="final-cta container">
        <h2 className="text-gradient">Ready To Build Your Startup?</h2>
        <p>Stop guessing. Start executing. Generate your structured workspace today.</p>
        <button className="btn btn-primary" onClick={onNavigateToBuilder}>
          Build My Startup
        </button>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>© 2026 PreStart Technologies, Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                Privacy Policy
              </a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                Terms of Service
              </a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', width: '100%', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Developed by <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Shriyan Kogta</span> | GitHub: <a href="https://github.com/Shriyan125" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>github.com/Shriyan125</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

