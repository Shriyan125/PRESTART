import React, { useState, useEffect, useRef } from 'react';

export default function WorkspaceView({ startupData, onNavigateToLanding, groqApiKey }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tasks' | 'competitors' | 'health'
  
  // Kanban State
  const [tasks, setTasks] = useState([]);
  const [activeInputColumn, setActiveInputColumn] = useState(null); // null | 'todo' | 'progress' | 'completed'
  const [newTaskText, setNewTaskText] = useState('');

  // Health Metrics State
  const [metrics, setMetrics] = useState({
    users: 75,
    revenue: 65,
    retention: 85,
    growth: 70,
    velocity: 90
  });

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi! I am your AI Co-Founder. Ask me anything about scaling, features, pricing, or product validation for your startup!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Initialize state from props
  useEffect(() => {
    if (startupData) {
      setTasks(startupData.tasks || []);
      setMetrics(startupData.metrics || {
        users: 75,
        revenue: 65,
        retention: 85,
        growth: 70,
        velocity: 90
      });
    }
  }, [startupData]);

  // Scroll chat window to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // KANBAN BOARD SYSTEM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const moveTask = (taskId, targetStatus) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: targetStatus };
        }
        return task;
      });

      // Recalculate execution velocity automatically based on completed ratio
      const completedCount = updated.filter(t => t.status === 'completed').length;
      const totalCount = updated.length;
      const newVelocity = Math.round((completedCount / (totalCount || 1)) * 40 + 60);
      setMetrics(prevMetrics => ({ ...prevMetrics, velocity: newVelocity }));

      return updated;
    });
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    moveTask(taskId, status);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleAddTask = (columnId) => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: 't_' + Date.now(),
      title: newTaskText.trim(),
      status: columnId,
      priority: 'Medium'
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setActiveInputColumn(null);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const regenerateAITasks = () => {
    const name = startupData.name;
    const freshTasks = [
      { id: "t_ai1", title: `Execute A/B testing on ${name} premium checkout pipelines`, status: "todo", priority: "High" },
      { id: "t_ai2", title: `Run localized search engine optimization audits to highlight key competitor search keywords`, status: "todo", priority: "Medium" },
      { id: "t_ai3", title: `Deploy new beta email notifications tracking active customer churn triggers`, status: "todo", priority: "High" },
      { id: "t_ai4", title: `Optimize database index loops on user registration queries`, status: "progress", priority: "High" },
      { id: "t_ai5", title: `Refine initial pricing structures on marketing copy`, status: "completed", priority: "Low" }
    ];
    setTasks(freshTasks);
  };

  // Get tasks filtered by status
  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HEALTH SCORE COMPUTATIONS & WIDGETS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleMetricChange = (key, val) => {
    setMetrics(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  const healthScore = Math.round(
    (metrics.users + metrics.revenue + metrics.retention + metrics.growth + metrics.velocity) / 5
  );

  // Circle circumference is 440 (2 * Math.PI * 70)
  const strokeOffset = 440 - (440 * healthScore) / 100;

  // Get Badge Class
  let healthStatusBadge = 'badge badge-success';
  let healthStatusText = 'Optimized';
  if (healthScore < 50) {
    healthStatusBadge = 'badge badge-error';
    healthStatusText = 'Critical Risk';
  } else if (healthScore < 75) {
    healthStatusBadge = 'badge badge-warning';
    healthStatusText = 'Needs Iteration';
  }

  // Choose recommendations
  const getAIRecommendation = () => {
    if (healthScore >= 90) {
      return "Your metrics are strong across all streams. Double down on scaling acquisition loops and test paid ads campaigns.";
    }

    const items = [
      { key: 'users', val: metrics.users, recommend: "Your biggest bottleneck is user acquisition. Shift engineering resources to organic search loops or community distribution setups before adding new modules." },
      { key: 'revenue', val: metrics.revenue, recommend: "Monetization speed is lagging. Add premium checkout forms or introduce a tier structures to monetize active power users early." },
      { key: 'retention', val: metrics.retention, recommend: "User retention is critical. Setup customer checkins, audit user feedback session logs, and resolve onboarding friction before scaling spend." },
      { key: 'growth', val: metrics.growth, recommend: "Growth trajectory suggests narrow positioning. Refine core slogans, interview non-converting leads, or niche down into a distinct cohort." },
      { key: 'velocity', val: metrics.velocity, recommend: "Sprint velocity looks slow. Your backlog might be overloaded. Cut out nice-to-have requests, lock down core milestones, and launch weekly." }
    ];

    items.sort((a, b) => a.val - b.val);
    return items[0].recommend;
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI ASSISTANT CHATBOT ENGINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendQuery(chatInput.trim());
    setChatInput('');
  };

  const sendQuery = async (queryText) => {
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsTyping(true);

    try {
      const compDetails = startupData.competitors?.map(c => `- ${c.name} (${c.price}): Strengths: ${c.strengths}, Weaknesses: ${c.weaknesses}, Opportunities: ${c.opportunities}`).join('\n') || "No competitor analysis generated yet.";
      const roadmapDetails = startupData.roadmap?.map(r => `- ${r.phase} (${r.title}): ${r.desc}`).join('\n') || "No roadmap generated yet.";
      
      const systemPrompt = `You are the AI Co-Founder for the startup: "${startupData.name}".
      Startup Concept/Idea: "${startupData.idea}"
      Startup Stage: "${startupData.stage}".
      Target timeline: "${startupData.timeline}".
      Team size: "${startupData.teamSize}".
      
      Here is our generated competitive landscape:
      ${compDetails}
      
      Here is our strategic roadmap:
      ${roadmapDetails}

      Your job is to act as a supportive, expert, and highly tactical co-founder. Offer direct, practical, and highly context-aware startup advice. Keep replies structured, concise, and clear. Respond directly to the user's questions. Do not write code unless specifically requested.`;

      // Call Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: "user", content: queryText }
          ],
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Failed chatbot fetch");
      }
      
      const reply = data.choices[0].message.content;
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error("Groq Chatbot request failed, using simulation fallback", err);
      
      const lowerQuery = queryText.toLowerCase();
      let reply = `I'm having a brief connection issue, but for ${startupData.name}: let's review our task backlog. What operational task are you currently focused on?`;
      if (lowerQuery.includes('price')) {
        reply = `For pricing ${startupData.name}, always target DTC gross margins of 70%+ or SaaS subscription tiers starting at $19/mo.`;
      } else if (lowerQuery.includes('competitor')) {
        reply = `Our key competitor is ${startupData.competitors?.[0]?.name || "industry standard products"}. We stand out by addressing their key gap: ${startupData.competitors?.[0]?.weaknesses || "slow shipping/onboarding"}.`;
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div id="view-workspace" className="view active">
      <div className="workspace-layout">
        {/* Sidebar Navigation */}
        <aside className="workspace-sidebar">
          <div className="sidebar-logo">
            <a href="#" className="logo" onClick={onNavigateToLanding}>
              <div className="logo-dot"></div>
              <span>PRESTART</span>
            </a>
          </div>
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              <li
                className={`sidebar-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <a href="#section-overview" onClick={(e) => e.preventDefault()}>
                  <span>📋</span> Overview & Roadmap
                </a>
              </li>
              <li
                className={`sidebar-menu-item ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <a href="#section-tasks" onClick={(e) => e.preventDefault()}>
                  <span>🗂️</span> AI Task Manager
                </a>
              </li>
              <li
                className={`sidebar-menu-item ${activeTab === 'competitors' ? 'active' : ''}`}
                onClick={() => setActiveTab('competitors')}
              >
                <a href="#section-competitors" onClick={(e) => e.preventDefault()}>
                  <span>🔍</span> Competitor Analysis
                </a>
              </li>
              <li
                className={`sidebar-menu-item ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
              >
                <a href="#section-health" onClick={(e) => e.preventDefault()}>
                  <span>📈</span> Startup Health
                </a>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-avatar">
              {startupData.name ? startupData.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <div className="sidebar-user-name">{startupData.name || 'Founder'} Dashboard</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PreStart Operating System</div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Canvas */}
        <main className="workspace-main">
          {/* Top Status Bar Header */}
          <header className="workspace-header">
            <div className="workspace-title-area">
              <h2>{startupData.name}</h2>
              <div className="workspace-metadata">
                <span className="meta-item">
                  <span className="meta-dot active"></span> Stage:{' '}
                  <strong>{startupData.stage}</strong>
                </span>
                <span className="meta-item">
                  Timeline: <strong>{startupData.timeline}</strong>
                </span>
                <span className="meta-item">
                  Team: <strong>{startupData.teamSize}</strong>
                </span>
              </div>
            </div>
            <div className="badge" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Health Index: {healthScore}%
            </div>
          </header>

          {/* DYNAMIC CONTENT VIEWS */}
          
          {/* 1. OVERVIEW & ROADMAP */}
          {activeTab === 'overview' && (
            <section id="section-overview" className="workspace-section">
              <div className="workspace-section-header">
                <h3 className="workspace-section-title">AI Roadmap</h3>
                <p className="workspace-section-subtitle">Your customized milestone plan based on launch deadlines.</p>
              </div>

              <div className="card">
                <div className="roadmap-timeline-container">
                  <div className="roadmap-timeline-line"></div>
                  <div className="roadmap-timeline-line-fill" style={{ height: '40%' }}></div>

                  <div>
                    {startupData.roadmap?.map((item, index) => {
                      let statusClass = 'pending';
                      if (index === 0) statusClass = 'completed';
                      else if (index === 1) statusClass = 'active';

                      return (
                        <div key={index} className={`roadmap-item ${statusClass}`}>
                          <div className="roadmap-bullet"></div>
                          <div className="roadmap-content">
                            <div className="roadmap-phase-header">
                              <span className="roadmap-phase-title">
                                {item.phase}: {item.title}
                              </span>
                              <span className="roadmap-phase-time">{item.time}</span>
                            </div>
                            <p className="roadmap-phase-details">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Co-Founder Recommendations */}
              <div className="workspace-section-header" style={{ marginTop: '40px' }}>
                <h3 className="workspace-section-title">AI Co-Founder Recommendations</h3>
                <p className="workspace-section-subtitle">
                  Tailored tactical guidelines for targeting your customer cohort: <strong>{startupData.targetCustomer}</strong>
                </p>
              </div>

              <div className="card">
                <div className="recommendations-container">
                  {startupData.recommendations && startupData.recommendations.map((rec, idx) => (
                    <div className="recommendation-card-item" key={idx}>
                      <div className="recommendation-badge-num">{idx + 1}</div>
                      <p className="recommendation-text-content">{rec}</p>
                    </div>
                  ))}
                  {(!startupData.recommendations || startupData.recommendations.length === 0) && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                      No recommendations generated yet. Define your startup parameters to begin.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 2. TASK MANAGER (KANBAN BOARD) */}
          {activeTab === 'tasks' && (
            <section id="section-tasks" className="workspace-section">
              <div className="workspace-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h3 className="workspace-section-title">AI Task Manager</h3>
                  <p className="workspace-section-subtitle">
                    Dynamic startup backlog. Drag cards or use quick actions to move items.
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={regenerateAITasks} style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                  🔮 Regenerate AI Tasks
                </button>
              </div>

              <div className="kanban-board">
                {/* TO DO COLUMN */}
                <div className="kanban-column" onDragOver={allowDrop} onDrop={(e) => handleDrop(e, 'todo')}>
                  <div className="kanban-column-header">
                    <span className="kanban-column-title">
                      <span style={{ color: 'var(--text-muted)' }}>●</span> To Do
                    </span>
                    <span className="kanban-column-count">{getTasksByStatus('todo').length}</span>
                  </div>
                  <div className="kanban-cards-container">
                    {getTasksByStatus('todo').map(task => (
                      <div
                        key={task.id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="kanban-card-title">{task.title}</div>
                        <div className="kanban-card-meta">
                          <span
                            className={`badge ${
                              task.priority === 'High'
                                ? 'badge-error'
                                : task.priority === 'Medium'
                                ? 'badge-warning'
                                : 'badge-success'
                            }`}
                            style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                          >
                            {task.priority}
                          </span>
                          <div className="kanban-card-actions">
                            <button className="kanban-card-btn" onClick={() => moveTask(task.id, 'progress')} title="Move to In Progress">▶</button>
                            <button className="kanban-card-btn" onClick={() => deleteTask(task.id)} title="Delete Task" style={{ marginLeft: '6px', color: 'var(--error-color)' }}>✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Task Control */}
                  <div className="kanban-add-card-wrapper">
                    {activeInputColumn !== 'todo' ? (
                      <button className="kanban-add-card-btn" onClick={() => setActiveInputColumn('todo')}>
                        + Add Task
                      </button>
                    ) : (
                      <div className="kanban-card-input-box">
                        <textarea
                          placeholder="Write task description..."
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                        />
                        <div className="kanban-input-actions">
                          <button className="btn btn-text" onClick={() => { setActiveInputColumn(null); setNewTaskText(''); }} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                            Cancel
                          </button>
                          <button className="btn btn-primary" onClick={() => handleAddTask('todo')} style={{ fontSize: '0.75rem', padding: '4px 12px', boxShadow: 'none' }}>
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* IN PROGRESS COLUMN */}
                <div className="kanban-column" onDragOver={allowDrop} onDrop={(e) => handleDrop(e, 'progress')}>
                  <div className="kanban-column-header">
                    <span className="kanban-column-title">
                      <span style={{ color: 'var(--accent-color)' }}>●</span> In Progress
                    </span>
                    <span className="kanban-column-count">{getTasksByStatus('progress').length}</span>
                  </div>
                  <div className="kanban-cards-container">
                    {getTasksByStatus('progress').map(task => (
                      <div
                        key={task.id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="kanban-card-title">{task.title}</div>
                        <div className="kanban-card-meta">
                          <span
                            className={`badge ${
                              task.priority === 'High'
                                ? 'badge-error'
                                : task.priority === 'Medium'
                                ? 'badge-warning'
                                : 'badge-success'
                            }`}
                            style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                          >
                            {task.priority}
                          </span>
                          <div className="kanban-card-actions">
                            <button className="kanban-card-btn" onClick={() => moveTask(task.id, 'todo')} title="Move to To Do">◀</button>
                            <button className="kanban-card-btn" onClick={() => moveTask(task.id, 'completed')} title="Move to Completed">▶</button>
                            <button className="kanban-card-btn" onClick={() => deleteTask(task.id)} title="Delete Task" style={{ marginLeft: '6px', color: 'var(--error-color)' }}>✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Task Control */}
                  <div className="kanban-add-card-wrapper">
                    {activeInputColumn !== 'progress' ? (
                      <button className="kanban-add-card-btn" onClick={() => setActiveInputColumn('progress')}>
                        + Add Task
                      </button>
                    ) : (
                      <div className="kanban-card-input-box">
                        <textarea
                          placeholder="Write task description..."
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                        />
                        <div className="kanban-input-actions">
                          <button className="btn btn-text" onClick={() => { setActiveInputColumn(null); setNewTaskText(''); }} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                            Cancel
                          </button>
                          <button className="btn btn-primary" onClick={() => handleAddTask('progress')} style={{ fontSize: '0.75rem', padding: '4px 12px', boxShadow: 'none' }}>
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* COMPLETED COLUMN */}
                <div className="kanban-column" onDragOver={allowDrop} onDrop={(e) => handleDrop(e, 'completed')}>
                  <div className="kanban-column-header">
                    <span className="kanban-column-title">
                      <span style={{ color: 'var(--success-color)' }}>●</span> Completed
                    </span>
                    <span className="kanban-column-count">{getTasksByStatus('completed').length}</span>
                  </div>
                  <div className="kanban-cards-container">
                    {getTasksByStatus('completed').map(task => (
                      <div
                        key={task.id}
                        className="kanban-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="kanban-card-title">{task.title}</div>
                        <div className="kanban-card-meta">
                          <span
                            className={`badge ${
                              task.priority === 'High'
                                ? 'badge-error'
                                : task.priority === 'Medium'
                                ? 'badge-warning'
                                : 'badge-success'
                            }`}
                            style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                          >
                            {task.priority}
                          </span>
                          <div className="kanban-card-actions">
                            <button className="kanban-card-btn" onClick={() => moveTask(task.id, 'progress')} title="Move to In Progress">◀</button>
                            <button className="kanban-card-btn" onClick={() => deleteTask(task.id)} title="Delete Task" style={{ marginLeft: '6px', color: 'var(--error-color)' }}>✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Task Control */}
                  <div className="kanban-add-card-wrapper">
                    {activeInputColumn !== 'completed' ? (
                      <button className="kanban-add-card-btn" onClick={() => setActiveInputColumn('completed')}>
                        + Add Task
                      </button>
                    ) : (
                      <div className="kanban-card-input-box">
                        <textarea
                          placeholder="Write task description..."
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                        />
                        <div className="kanban-input-actions">
                          <button className="btn btn-text" onClick={() => { setActiveInputColumn(null); setNewTaskText(''); }} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                            Cancel
                          </button>
                          <button className="btn btn-primary" onClick={() => handleAddTask('completed')} style={{ fontSize: '0.75rem', padding: '4px 12px', boxShadow: 'none' }}>
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. COMPETITOR ANALYSIS */}
          {activeTab === 'competitors' && (
            <section id="section-competitors" className="workspace-section">
              <div className="workspace-section-header">
                <h3 className="workspace-section-title">Competitor Analysis</h3>
                <p className="workspace-section-subtitle">
                  Real-time breakdown of top competitive projects, pricing, and structural gaps.
                </p>
              </div>

              <div className="competitor-grid">
                {startupData.competitors?.map((comp, index) => (
                  <div key={index} className="card competitor-card">
                    <div className="competitor-header">
                      <span className="competitor-name">{comp.name}</span>
                      <span className="competitor-price">{comp.price}</span>
                    </div>
                    <div className="competitor-details-list">
                      <div className="competitor-detail-item">
                        <span className="competitor-detail-label">Core Strength</span>
                        <span className="competitor-detail-value">{comp.strengths}</span>
                      </div>
                      <div className="competitor-detail-item">
                        <span className="competitor-detail-label">Key Weakness</span>
                        <span className="competitor-detail-value">{comp.weaknesses}</span>
                      </div>
                      <div className="competitor-detail-item">
                        <span className="competitor-detail-label">Market Opportunity</span>
                        <span className="competitor-detail-value" style={{ color: '#C084FC' }}>
                          {comp.opportunities}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. STARTUP HEALTH SCORE */}
          {activeTab === 'health' && (
            <section id="section-health" className="workspace-section">
              <div className="workspace-section-header">
                <h3 className="workspace-section-title">Startup Health Score</h3>
                <p className="workspace-section-subtitle">
                  Monitor execution metrics, speed indicators, and risk analysis recommendation.
                </p>
              </div>

              <div className="health-score-layout">
                {/* SVG Radial Progress */}
                <div className="health-radial-box">
                  <div className="health-svg-wrapper">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle className="health-svg-circle-bg" cx="80" cy="80" r="70" />
                      <circle
                        className="health-svg-circle-fill"
                        cx="80"
                        cy="80"
                        r="70"
                        style={{ strokeDashoffset: strokeOffset }}
                      />
                    </svg>
                    <div className="health-score-value">{healthScore}%</div>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                    Health Index Status
                  </h4>
                  <div className={healthStatusBadge}>{healthStatusText}</div>
                </div>

                {/* Health Metric Sliders */}
                <div className="card" style={{ width: '100%' }}>
                  <div className="health-metrics-sliders">
                    <div className="metric-slider-group">
                      <div className="metric-slider-label-row">
                        <span>User Growth velocity</span>
                        <span className="metric-slider-value">{metrics.users}%</span>
                      </div>
                      <input
                        type="range"
                        className="metric-slider"
                        min="0"
                        max="100"
                        value={metrics.users}
                        onChange={(e) => handleMetricChange('users', e.target.value)}
                      />
                    </div>
                    <div className="metric-slider-group">
                      <div className="metric-slider-label-row">
                        <span>Revenue Velocity</span>
                        <span className="metric-slider-value">{metrics.revenue}%</span>
                      </div>
                      <input
                        type="range"
                        className="metric-slider"
                        min="0"
                        max="100"
                        value={metrics.revenue}
                        onChange={(e) => handleMetricChange('revenue', e.target.value)}
                      />
                    </div>
                    <div className="metric-slider-group">
                      <div className="metric-slider-label-row">
                        <span>Customer Retention Rate</span>
                        <span className="metric-slider-value">{metrics.retention}%</span>
                      </div>
                      <input
                        type="range"
                        className="metric-slider"
                        min="0"
                        max="100"
                        value={metrics.retention}
                        onChange={(e) => handleMetricChange('retention', e.target.value)}
                      />
                    </div>
                    <div className="metric-slider-group">
                      <div className="metric-slider-label-row">
                        <span>Market Growth Rate</span>
                        <span className="metric-slider-value">{metrics.growth}%</span>
                      </div>
                      <input
                        type="range"
                        className="metric-slider"
                        min="0"
                        max="100"
                        value={metrics.growth}
                        onChange={(e) => handleMetricChange('growth', e.target.value)}
                      />
                    </div>
                    <div className="metric-slider-group">
                      <div className="metric-slider-label-row">
                        <span>Execution Speed (Velocity)</span>
                        <span className="metric-slider-value">{metrics.velocity}%</span>
                      </div>
                      <input
                        type="range"
                        className="metric-slider"
                        min="0"
                        max="100"
                        value={metrics.velocity}
                        onChange={(e) => handleMetricChange('velocity', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic recommendation card */}
              <div className="card health-recommendation-card">
                <div className="health-recommendation-title">
                  <span>🤖</span> AI Co-Founder Recommendation
                </div>
                <div className="health-recommendation-text">"{getAIRecommendation()}"</div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* FLOATING AI ASSISTANT PANEL & TRIGGER */}
      <button
        className={`assistant-trigger-btn ${chatOpen ? 'hidden' : ''}`}
        onClick={() => setChatOpen(true)}
      >
        💬
      </button>

      <div className={`assistant-chat-panel ${chatOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-dot"></div>
            <div className="chat-header-title">AI Co-Founder Chat</div>
          </div>
          <button className="chat-header-close" onClick={() => setChatOpen(false)}>
            ×
          </button>
        </div>

        {/* Message Area */}
        <div className="chat-messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chat-message ai loading-indicator">
              Writing response...
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="chat-suggestions">
          <button className="chat-suggestion-chip" onClick={() => sendQuery('What should I build next?')}>
            What should I build next?
          </button>
          <button className="chat-suggestion-chip" onClick={() => sendQuery('How should I price this?')}>
            How should I price this?
          </button>
          <button className="chat-suggestion-chip" onClick={() => sendQuery('Who are my competitors?')}>
            Who are my competitors?
          </button>
          <button className="chat-suggestion-chip" onClick={() => sendQuery('How do I get my first 100 users?')}>
            How do I get my first 100 users?
          </button>
        </div>

        {/* Input Form */}
        <form className="chat-input-form" onSubmit={handleChatSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder="Ask your AI Co-Founder..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit" className="chat-send-btn">
            ➔
          </button>
        </form>
      </div>
    </div>
  );
}
