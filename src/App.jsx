import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// ===== ANIMATED COUNTER COMPONENT =====
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// ===== FADE IN SECTION COMPONENT =====
const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// ===== FLOATING PARTICLES BACKGROUND =====
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
export default function BlueAllyAIWorkshop() {
  const [activeStep, setActiveStep] = useState(null);
  const [activePainPoint, setActivePainPoint] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', title: '', email: '', phone: '', size: '', challenge: '' });

  // Data for charts
  const dataGrowthData = [
    { year: '2010', value: 2 },
    { year: '2015', value: 15 },
    { year: '2020', value: 64 },
    { year: '2024', value: 147 },
    { year: '2030', value: 400 },
  ];

  const successRateData = [
    { name: 'Multi-Vendor', value: 38, color: '#999999' },
    { name: 'Single-Vendor', value: 73, color: '#00B34A' },
    { name: 'External Partner', value: 66, color: '#00A3E0' },
    { name: 'Internal Only', value: 33, color: '#999999' },
  ];

  const marketCapData = [
    { name: '2023 Non-Innovation', value: 98 },
    { name: '2023 Disruptive', value: 19 },
    { name: '2030 Non-Innovation', value: 140 },
    { name: '2030 Disruptive', value: 220 },
  ];

  // Pain points data
  const painPoints = [
    { id: 1, name: 'Delays & Handoffs', icon: '⏱️', description: 'Process bottlenecks where work waits for approvals or coordination between teams', solution: 'Automated routing & intelligent approvals' },
    { id: 2, name: 'Rework & Errors', icon: '🔄', description: 'High error rates and quality failures requiring manual correction and validation', solution: 'Quality prediction & automated validation' },
    { id: 3, name: 'Compliance Gaps', icon: '⚖️', description: 'Regulatory violations, audit findings, and inconsistent policy adherence', solution: 'Continuous compliance monitoring' },
    { id: 4, name: 'Knowledge Gaps', icon: '🧠', description: 'Work stalls when employees lack expertise or need specialist input', solution: 'AI-powered knowledge retrieval (RAG)' },
    { id: 5, name: 'Seasonal Peaks', icon: '📈', description: 'Demand fluctuations and capacity constraints during peak periods', solution: 'Predictive scaling & smart automation' },
    { id: 6, name: 'Repetitive Work', icon: '🔁', description: 'High-volume, low-complexity tasks consuming employee time', solution: 'Intelligent process automation' },
    { id: 7, name: 'Data Silos', icon: '🗄️', description: 'Information trapped in disconnected systems requiring manual aggregation', solution: 'Unified data fabric with RAG + MCP' },
    { id: 8, name: 'CX Friction', icon: '😤', description: 'Slow response times, inconsistent service, and lack of personalization', solution: 'AI-enhanced customer engagement' },
  ];

  // Seven steps data
  const sevenSteps = [
    { num: 1, name: 'Anchor to Strategy', description: 'Define your business drivers and OKRs. Align AI investments with strategic pillars: Operational Excellence, Resource Optimization, Intelligence, Decision Acceleration.', deliverable: 'Strategic Alignment Documentation' },
    { num: 2, name: 'Inventory Functions', description: 'Comprehensive inventory of business functions across all departments. Know where the friction lives.', deliverable: 'Function Mapping Matrix' },
    { num: 3, name: 'Map Pain Points', description: 'Identify delays, errors, rework, compliance gaps across workflows: proposals, specifications, materials, safety, project management.', deliverable: 'Prioritized Pain Point Inventory' },
    { num: 4, name: 'Match AI Primitives', description: 'Assign the right AI capability to each problem: NLP, Computer Vision, Predictive Analytics, Optimization engines.', deliverable: 'Technology-to-Problem Mapping' },
    { num: 5, name: 'Define KPIs', description: 'Establish baseline, target, and measurement methodology. Include industry benchmarks for defensibility.', deliverable: 'KPI Framework with Benchmarks' },
    { num: 6, name: 'Quantify Impact', description: 'Translate KPI improvements into dollars across Revenue Growth, Cost Reduction, Cash Flow, and Risk Reduction.', deliverable: 'Financial Impact Model' },
    { num: 7, name: 'Score & Rank', description: 'Prioritize based on: Value, Time-to-Value, Effort, Probability of Success, and Strategic Alignment.', deliverable: 'Ranked Use Case Portfolio' },
  ];

  // Eight stages data
  const eightStages = [
    { num: 1, name: 'AI Education', week: 'Week 1', activities: ['AI briefing on trends, patterns, platforms', 'Readiness framework review', 'Risk and governance overview'], deliverables: ['AI Strategy Brief', 'Success Metrics Framework'], phase: 'Foundation' },
    { num: 2, name: 'Discovery & Prioritization', week: 'Weeks 2-4', activities: ['Use case workshop', 'Ranking and ROI exercise', 'AI readiness assessment'], deliverables: ['Prioritized Use Case Portfolio', 'Business Value Map'], phase: 'Foundation' },
    { num: 3, name: 'Design & Scope', week: 'Weeks 5-6', activities: ['Solution architecture design', 'Integration pattern selection', 'Development scoping'], deliverables: ['Technical Architecture Doc', 'Development Scope Statement'], phase: 'Planning' },
    { num: 4, name: 'Tech Assessment', week: 'Weeks 7-8', activities: ['Data quality audit', 'Security posture analysis', 'Skills gap identification'], deliverables: ['Readiness Report', 'Skills Development Plan'], phase: 'Planning' },
    { num: 5, name: 'Procurement', week: 'Weeks 7-8', activities: ['Vendor selection', 'Platform licensing', 'SLA establishment'], deliverables: ['Contracts', 'Implementation Timeline'], phase: 'Execution' },
    { num: 6, name: 'Development', week: 'Weeks 10-16', activities: ['Pilot application development', 'Iterative testing', 'Integration & UAT'], deliverables: ['Working Application', 'Test Results'], phase: 'Execution' },
    { num: 7, name: 'Delivery & Testing', week: 'Weeks 17-20', activities: ['Production deployment', 'User training', 'Change management'], deliverables: ['Live System', 'Trained Users'], phase: 'Execution' },
    { num: 8, name: 'Managed Services', week: 'Ongoing', activities: ['Performance monitoring', 'Feature enhancement', 'ROI reporting'], deliverables: ['Continuous Improvement', 'ROI Dashboards'], phase: 'Optimization' },
  ];

  const deliverables = [
    { icon: '📋', title: 'AI Strategy Brief', description: 'Comprehensive AI trends, build patterns, platforms, risks, and governance frameworks' },
    { icon: '📊', title: 'Business Value Map', description: 'Visual mapping of use cases to financial impact across revenue, cost, cash, and risk' },
    { icon: '🎯', title: 'Prioritized Portfolio', description: 'Ranked list of 3-5 high-impact opportunities with detailed ROI estimates' },
    { icon: '⚙️', title: 'Technical Architecture', description: 'Solution design, integration patterns, and development scope documentation' },
    { icon: '📐', title: 'Resource Analysis', description: 'Staffing, skills, platform, and partner requirements analysis' },
    { icon: '🛡️', title: 'Readiness Assessment', description: 'Data quality, infrastructure, and security posture analysis' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        
        * { box-sizing: border-box; }
        
        .gradient-text {
          background: linear-gradient(135deg, #003B73 0%, #00A3E0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 59, 115, 0.1);
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 59, 115, 0.15);
        }
        
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 179, 74, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 179, 74, 0.6); }
        }
        
        .step-connector {
          position: relative;
        }
        .step-connector::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -20px;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #00A3E0, #003B73);
        }
        
        .timeline-line {
          background: linear-gradient(90deg, #003B73, #00A3E0, #00B34A);
        }
      `}</style>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #003B73 0%, #001d3a 50%, #00A3E0 100%)' }}>
        <ParticleBackground />
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/10 rounded-full" style={{ animation: 'spin 20s linear infinite' }} />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/10 rotate-45" style={{ animation: 'spin 30s linear infinite reverse' }} />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-lg" style={{ animation: 'float 8s ease-in-out infinite' }} />
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Logo */}
          <FadeInSection>
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">B</span>
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">BlueAlly</span>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Don't Know How to<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #00A3E0, #00B34A)' }}>
                Get Started with AI?
              </span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <h2 className="text-2xl md:text-4xl font-medium text-white/90 mb-8">
              Conduct a BlueAlly AI Use Case Workshop
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-6xl md:text-8xl font-bold text-red-400">95%</span>
                <span className="text-white/80 text-lg text-left">of GenAI pilots show<br /><strong className="text-white">NO measurable P&L impact</strong></span>
              </div>
              <div className="w-full h-px bg-white/20 my-4" />
              <p className="text-white/90 text-lg">
                Join the <span className="text-green-400 font-bold text-2xl">5%</span> who extract millions in value.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full hover:shadow-2xl transition-all duration-300 pulse-glow flex items-center gap-2">
                Schedule Your Workshop
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <button className="px-8 py-4 border-2 border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch 2-Min Overview
              </button>
            </div>
          </FadeInSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== STATISTICS BAR ===== */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 80, suffix: '%', label: 'Corporate data is unstructured', color: '#003B73' },
              { value: 60, suffix: '%', label: 'IT budget on only 20% of insights', color: '#00A3E0' },
              { value: 40, prefix: '$', suffix: 'B', label: 'Invested with no P&L impact', color: '#dc2626' },
              { value: 5, suffix: '%', label: 'Achieve real AI ROI', color: '#00B34A' },
            ].map((stat, i) => (
              <FadeInSection key={i} delay={i * 0.1} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: THE PROBLEM ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#003B73' }}>
              Why <span className="text-red-500">95%</span> of AI Initiatives Fail
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MIT, McKinsey, and industry research reveal the critical failure patterns—and how to avoid them.
            </p>
          </FadeInSection>

          {/* Pain Point Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {painPoints.map((point, i) => (
              <FadeInSection key={point.id} delay={i * 0.05}>
                <div
                  className={`glass-card rounded-xl p-6 cursor-pointer hover-lift ${activePainPoint === point.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActivePainPoint(activePainPoint === point.id ? null : point.id)}
                >
                  <div className="text-4xl mb-3">{point.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{point.name}</h3>
                  {activePainPoint === point.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                      <p className="text-sm font-medium" style={{ color: '#00B34A' }}>✓ {point.solution}</p>
                    </div>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* MIT Research Box */}
          <FadeInSection>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">MIT Media Lab Research 2025</h3>
                  <p className="text-gray-400">Project NANDA - "The GenAI Divide: State of AI in Business"</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-red-400 mb-4">❌ Why They Fail (95%)</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Lack of Executive Sponsorship</li>
                    <li>• No discernible ROI identified</li>
                    <li>• Too many use cases (6.1 avg vs. 3.5 ideal)</li>
                    <li>• Unable to move from pilot phase</li>
                    <li>• Internal builds only (33% success rate)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-green-400 mb-4">✓ Why They Succeed (5%)</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• External partnerships (66% success - 2x better)</li>
                    <li>• 90-day pilot-to-production timeline</li>
                    <li>• Back-office automation focus (higher ROI)</li>
                    <li>• Business outcome measurement from day 0</li>
                    <li>• Workflow-embedded, adaptive systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SECTION 3: THE DATA OPPORTUNITY ===== */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#003B73' }}>
              Unlock the <span style={{ color: '#00A3E0' }}>80%</span> of Corporate Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LLMs combined with RAG unlock unstructured data for decision making. Generative AI transforms the other 80%.
            </p>
          </FadeInSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Data Visualization */}
            <FadeInSection>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="font-bold text-xl mb-6" style={{ color: '#003B73' }}>Corporate Data Landscape</h3>
                
                <div className="space-y-6">
                  {/* Unstructured */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Unstructured Data</span>
                      <span className="font-bold" style={{ color: '#003B73' }}>80%</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '80%', background: 'linear-gradient(90deg, #003B73, #00A3E0)' }} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Documents, emails, images, video, audio</p>
                  </div>

                  {/* Structured */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Structured Data</span>
                      <span className="font-bold text-gray-500">20%</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Databases, spreadsheets, CRM/ERP</p>
                  </div>

                  {/* Investment Imbalance */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                    <p className="text-red-800 font-medium text-center">
                      ⚠️ Inverse Investment: <strong>60%</strong> of IT budget goes to <strong>20%</strong> of data (structured)
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* RAG vs MCP */}
            <FadeInSection delay={0.2}>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#003B73' }}>RAG</div>
                    <h4 className="text-xl font-bold" style={{ color: '#003B73' }}>Retrieval-Augmented Generation</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Best for unstructured, static data: Documents, PDFs, wikis, manuals</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Vector embeddings</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Low latency</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Historical context</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#00A3E0' }}>MCP</div>
                    <h4 className="text-xl font-bold" style={{ color: '#00A3E0' }}>Model Context Protocol</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Best for structured, real-time data: Databases, APIs, SaaS platforms</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">On-demand API</span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">Always current</span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">OAuth2/RBAC</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔗</span>
                    <div>
                      <h4 className="font-bold text-lg">Hybrid Approach: RAG + MCP</h4>
                      <p className="text-white/90">Complete Context = Historical Knowledge + Current State</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Data Growth Stats */}
          <FadeInSection className="mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#003B73' }}>Exponential Data Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataGrowthData}>
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Line type="monotone" dataKey="value" stroke="#00A3E0" strokeWidth={3} dot={{ fill: '#003B73', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: '#003B73' }}>402.74M TB</div>
                  <div className="text-sm text-gray-500">Created Daily</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: '#00A3E0' }}>147 ZB</div>
                  <div className="text-sm text-gray-500">Annual (2024)</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: '#00B34A' }}>26%</div>
                  <div className="text-sm text-gray-500">CAGR Growth</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-500">90%</div>
                  <div className="text-sm text-gray-500">Created in Last 2 Years</div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SECTION 4: SEVEN-STEP FRAMEWORK ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#003B73' }}>
              The BlueAlly <span style={{ color: '#00A3E0' }}>Seven-Step</span> Framework
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A rigorous methodology that ensures measurable, defensible ROI for every AI initiative.
            </p>
          </FadeInSection>

          {/* Steps Timeline */}
          <div className="relative mb-16">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block">
              <div className="h-full timeline-line" style={{ width: `${((activeStep || 0) / 7) * 100}%`, transition: 'width 0.5s ease' }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {sevenSteps.map((step, i) => (
                <FadeInSection key={step.num} delay={i * 0.1}>
                  <div
                    className={`relative cursor-pointer transition-all duration-300 ${activeStep === step.num ? 'transform scale-105' : ''}`}
                    onClick={() => setActiveStep(activeStep === step.num ? null : step.num)}
                  >
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 transition-all duration-300 ${activeStep === step.num ? 'ring-4 ring-green-400 ring-offset-4' : ''}`}
                      style={{ background: activeStep === step.num ? '#00B34A' : 'linear-gradient(135deg, #003B73, #00A3E0)' }}
                    >
                      {step.num}
                    </div>
                    <h4 className="text-center font-bold text-sm" style={{ color: '#003B73' }}>{step.name}</h4>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>

          {/* Expanded Step Detail */}
          {activeStep && (
            <FadeInSection className="mb-12">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0" style={{ background: '#00B34A' }}>
                    {activeStep}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{sevenSteps[activeStep - 1].name}</h3>
                    <p className="text-blue-100 mb-4">{sevenSteps[activeStep - 1].description}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                      <span className="text-green-400">📦</span>
                      <span className="font-medium">Deliverable: {sevenSteps[activeStep - 1].deliverable}</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          )}

          {/* Value Props */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '✓', title: 'Rigorous Methodology', desc: 'Every dollar traces to specific operational improvements' },
              { icon: '✓', title: 'Defensible Projections', desc: 'Conservative assumptions ensure realistic estimates' },
              { icon: '✓', title: 'Transparent Deduplication', desc: 'Eliminate overlapping benefit claims' },
              { icon: '✓', title: 'Strategic Alignment', desc: 'Each initiative maps to business outcomes' },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-xl p-6 hover-lift">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-4" style={{ background: '#00B34A' }}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: '#003B73' }}>{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: DELIVERABLES ===== */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #003B73 0%, #001d3a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Workshop <span style={{ color: '#00A3E0' }}>Deliverables</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Walk away with everything you need to launch AI with confidence.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6">
            {deliverables.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover-lift">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-blue-200">{item.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: 8-STAGE JOURNEY ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#003B73' }}>
              Foundation → Planning → Execution → Optimization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Single-Vendor Advantage: <strong style={{ color: '#00B34A' }}>35% fewer issues</strong>, <strong style={{ color: '#00A3E0' }}>40% faster deployment</strong>
            </p>
          </FadeInSection>

          {/* Phase Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Foundation', 'Planning', 'Execution', 'Optimization'].map((phase) => (
              <button
                key={phase}
                className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                style={{
                  background: activeStage === phase || !activeStage ? 'linear-gradient(90deg, #003B73, #00A3E0)' : '#f3f4f6',
                  color: activeStage === phase || !activeStage ? 'white' : '#666',
                }}
                onClick={() => setActiveStage(activeStage === phase ? null : phase)}
              >
                {phase}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="grid md:grid-cols-4 gap-6">
            {eightStages
              .filter(s => !activeStage || s.phase === activeStage)
              .map((stage, i) => (
                <FadeInSection key={stage.num} delay={i * 0.1}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover-lift h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: stage.phase === 'Optimization' ? '#00B34A' : 'linear-gradient(135deg, #003B73, #00A3E0)' }}>
                        {stage.num}
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: '#003B73' }}>{stage.name}</h4>
                        <p className="text-sm text-gray-500">{stage.week}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {stage.activities.slice(0, 3).map((act, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <span style={{ color: '#00A3E0' }}>•</span>
                          {act}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-2">Deliverables:</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.deliverables.map((del, j) => (
                          <span key={j} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{del}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: BUSINESS IMPACT ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#003B73' }}>
              Measurable <span style={{ color: '#00B34A' }}>Business Impact</span>
            </h2>
            <p className="text-xl text-gray-600">Single-vendor approach delivers proven results</p>
          </FadeInSection>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { value: '25-30%', label: 'Cost Reduction (TCO)', color: '#003B73' },
              { value: '40%', label: 'Faster Deployment', color: '#00A3E0' },
              { value: '35%', label: 'Fewer Critical Issues', color: '#00B34A' },
              { value: '2.6x', label: 'Higher Success Rate', color: '#003B73' },
              { value: '70%+', label: 'User Adoption Rate', color: '#00A3E0' },
              { value: '20-30%', label: 'Process Efficiency', color: '#00B34A' },
            ].map((metric, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover-lift">
                  <div className="text-5xl font-bold mb-2" style={{ color: metric.color }}>{metric.value}</div>
                  <div className="text-gray-600">{metric.label}</div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Success Rate Chart */}
          <FadeInSection>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#003B73' }}>Success Rate by Approach</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={successRateData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} stroke="#666" />
                    <YAxis type="category" dataKey="name" width={120} stroke="#666" />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {successRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-gray-500 mt-4">Source: Enterprise AI Implementation Research 2025</p>
            </div>
          </FadeInSection>

          {/* Real-World ROI Examples */}
          <FadeInSection className="mt-12">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Proven Results Across Industries</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '💰', company: 'JPMorgan Chase', result: '$1-2B annual value', detail: '450+ AI use cases' },
                  { icon: '📈', company: 'McKinsey Lilli', result: '30%+ time savings', detail: '92% staff adoption' },
                  { icon: '📄', company: 'Document Processing', result: '360,000 hours saved', detail: 'Annually' },
                ].map((example, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl mb-3">{example.icon}</div>
                    <h4 className="font-bold text-lg mb-1">{example.company}</h4>
                    <p className="text-green-400 font-bold">{example.result}</p>
                    <p className="text-blue-200 text-sm">{example.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SECTION 8: SOCIAL PROOF ===== */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInSection className="text-center mb-10">
            <h3 className="text-xl font-medium text-gray-600 mb-6">Research Foundations</h3>
            <p className="text-gray-500 mb-8">Our methodology incorporates findings from leading institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {['MIT Media Lab', 'McKinsey & Co', 'Gartner', 'Forrester', 'OpenAI'].map((org, i) => (
                <div key={i} className="text-gray-400 font-bold text-lg">{org}</div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== SECTION 9: FINAL CTA ===== */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #003B73 0%, #001d3a 50%, #00A3E0 100%)' }}>
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Join the <span style={{ color: '#00B34A' }}>5%</span> Who Achieve Real AI ROI?
            </h2>
            <p className="text-xl text-blue-200">
              Schedule your AI Use Case Workshop consultation today
            </p>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <span className="text-4xl">🚀</span>
                <h3 className="text-2xl font-bold mt-4" style={{ color: '#003B73' }}>Schedule Your Workshop</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Work Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                >
                  <option value="">Company Size</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1,000 employees</option>
                  <option value="1001-5000">1,001-5,000 employees</option>
                  <option value="5000+">5,000+ employees</option>
                </select>
              </div>

              <select
                className="w-full mt-4 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              >
                <option value="">Primary AI Challenge</option>
                <option value="getting-started">Don't know where to start</option>
                <option value="pilot-stuck">Stuck in pilot phase</option>
                <option value="no-roi">Can't demonstrate ROI</option>
                <option value="too-many">Too many potential use cases</option>
                <option value="executive">Need executive buy-in</option>
                <option value="other">Other</option>
              </select>

              <button className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all duration-300 pulse-glow">
                Schedule My Workshop
              </button>

              <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><span className="text-green-500">✓</span> No obligation</span>
                <span className="flex items-center gap-2"><span className="text-green-500">✓</span> 30-min discovery call</span>
                <span className="flex items-center gap-2"><span className="text-green-500">✓</span> Custom analysis</span>
              </div>
            </div>
          </FadeInSection>

          {/* Urgency */}
          <FadeInSection delay={0.4} className="mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <p className="text-white font-medium">
                ⚡ <strong>Limited Availability</strong> — We conduct only 8 workshops per month to ensure quality.
                <br />
                <span className="text-blue-200">Current wait time: 2-3 weeks</span>
              </p>
            </div>
          </FadeInSection>

          {/* Alternative Contact */}
          <FadeInSection delay={0.5} className="mt-8 text-center">
            <p className="text-blue-200 mb-4">Prefer another way to connect?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+1-800-BLUEALLY" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 flex items-center gap-2">
                📞 Call Us
              </a>
              <a href="mailto:ai-workshops@blueally.com" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 flex items-center gap-2">
                ✉️ Email Us
              </a>
              <a href="#" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 flex items-center gap-2">
                📅 Book Directly
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold text-white">BlueAlly</span>
            </div>
            <p className="text-center">
              Trade complexity for capability. Conquer IT with BlueAlly.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2025 BlueAlly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
