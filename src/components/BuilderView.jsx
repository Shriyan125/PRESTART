import React, { useState } from 'react';

export default function BuilderView({
  onNavigateToLanding,
  onSubmit,
  clarifyingQuestions = [],
  onAnswersSubmit
}) {
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [stage, setStage] = useState('Idea');
  const [teamSize, setTeamSize] = useState('Solo Founder');
  const [timeline, setTimeline] = useState('3 Months');
  const [answers, setAnswers] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) return;
    onSubmit({ name, idea, stage, teamSize, timeline });
  };

  const handleAnswerChange = (q, val) => {
    setAnswers((prev) => ({ ...prev, [q]: val }));
  };

  const handleAnswersFormSubmit = (e) => {
    e.preventDefault();
    // Validate that all questions have answers
    const allAnswered = clarifyingQuestions.every(q => answers[q] && answers[q].trim().length > 0);
    if (!allAnswered) return;
    onAnswersSubmit(answers);
  };

  const isQuestionsWizardActive = clarifyingQuestions && clarifyingQuestions.length > 0;

  return (
    <div id="view-builder" className="view active">
      <header className="builder-header">
        <div className="container builder-header-container">
          <a href="#" className="logo" onClick={onNavigateToLanding}>
            <div className="logo-dot"></div>
            <span>PRESTART</span>
          </a>
        </div>
      </header>

      <div className="builder-flow-container">
        {isQuestionsWizardActive ? (
          <div className="card builder-card">
            <h2>AI Co-Founder Inquiries</h2>
            <p className="builder-card-subtitle">
              To construct a highly tailored execution workspace, your AI Co-founder needs a few clarifications:
            </p>

            <form onSubmit={handleAnswersFormSubmit}>
              {clarifyingQuestions.map((q, idx) => (
                <div className="form-group" key={idx}>
                  <label className="form-label" style={{ lineHeight: '1.4', marginBottom: '10px' }}>
                    {idx + 1}. {q}
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Provide details..."
                    value={answers[q] || ''}
                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                    required
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>
              ))}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', height: '48px' }}>
                Build Workspace with Clarifications
              </button>
            </form>
          </div>
        ) : (
          <div className="card builder-card">
            <h2>Let's Build Your Startup</h2>
            <p className="builder-card-subtitle">
              Tell us about your idea, and our AI will build your custom dashboard, task list, and competitor models.
            </p>

            <form id="startup-builder-form" onSubmit={handleSubmit}>
              {/* Startup Name */}
              <div className="form-group">
                <label htmlFor="input-startup-name" className="form-label">
                  Startup Name
                </label>
                <input
                  type="text"
                  id="input-startup-name"
                  className="form-input"
                  placeholder="e.g., VetPulse, ResumePulse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Startup Idea */}
              <div className="form-group">
                <label htmlFor="input-startup-idea" className="form-label">
                  Startup Idea (The more details, the better)
                </label>
                <textarea
                  id="input-startup-idea"
                  className="form-textarea"
                  placeholder="e.g., A mobile app connecting pet owners with local veterinarians for on-demand video calls, subscription-based pricing..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Current Stage */}
              <div className="form-group">
                <label className="form-label">Current Stage</label>
                <div className="radio-card-grid">
                  <label
                    className={`radio-card ${stage === 'Idea' ? 'selected' : ''}`}
                    onClick={() => setStage('Idea')}
                  >
                    <input type="radio" name="input-stage" value="Idea" checked={stage === 'Idea'} readOnly />
                    <div className="radio-card-content">
                      <div className="radio-card-title">💡 Idea Stage</div>
                      <div className="radio-card-desc">Just an idea, researching market fit.</div>
                    </div>
                  </label>
                  <label
                    className={`radio-card ${stage === 'MVP' ? 'selected' : ''}`}
                    onClick={() => setStage('MVP')}
                  >
                    <input type="radio" name="input-stage" value="MVP" checked={stage === 'MVP'} readOnly />
                    <div className="radio-card-content">
                      <div className="radio-card-title">🛠️ MVP</div>
                      <div className="radio-card-desc">Building or have built prototype.</div>
                    </div>
                  </label>
                  <label
                    className={`radio-card ${stage === 'Beta' ? 'selected' : ''}`}
                    onClick={() => setStage('Beta')}
                  >
                    <input type="radio" name="input-stage" value="Beta" checked={stage === 'Beta'} readOnly />
                    <div className="radio-card-content">
                      <div className="radio-card-title">🧪 Beta</div>
                      <div className="radio-card-desc">Private testing with active users.</div>
                    </div>
                  </label>
                  <label
                    className={`radio-card ${stage === 'Growth' ? 'selected' : ''}`}
                    onClick={() => setStage('Growth')}
                  >
                    <input type="radio" name="input-stage" value="Growth" checked={stage === 'Growth'} readOnly />
                    <div className="radio-card-content">
                      <div className="radio-card-title">📈 Growth</div>
                      <div className="radio-card-desc">Monetizing, scaling customer base.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Team Size */}
              <div className="form-group">
                <label htmlFor="select-team-size" className="form-label">
                  Team Size
                </label>
                <select
                  id="select-team-size"
                  className="form-select"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                >
                  <option value="Solo Founder">Solo Founder</option>
                  <option value="2-5 People">2-5 People</option>
                  <option value="5+ People">5+ People</option>
                </select>
              </div>

              {/* Timeline */}
              <div className="form-group">
                <label htmlFor="select-timeline" className="form-label">
                  Target Launch Timeline
                </label>
                <select
                  id="select-timeline"
                  className="form-select"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', height: '48px' }}>
                Generate Startup Plan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

