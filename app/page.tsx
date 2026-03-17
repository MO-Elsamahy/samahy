'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useInView, animate } from 'framer-motion';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: 'MZ-OS v2.0.26  Copyright (C) MZ for Tech Solutions', color: '#ffb830' },
  { text: 'Loading AI kernel modules..............  [  OK  ]', color: '#00e639' },
  { text: 'Loading Data Science core..............  [  OK  ]', color: '#00e639' },
  { text: 'Mounting portfolio filesystem...........  [  OK  ]', color: '#00e639' },
  { text: '', color: '' },
  { text: 'System ready. Welcome, visitor.', color: '#29d4ff' },
  { text: 'C:\\USERS\\VISITOR> whoami --full', color: '#ccf0cc' },
];
const SKILLS = [
  { name: 'Python / Machine Learning', level: 92 },
  { name: 'Data Science & Analytics', level: 90 },
  { name: 'AI System Design', level: 88 },
  { name: 'Climate Policy & Advocacy', level: 88 },
  { name: 'Project Management', level: 86 },
  { name: 'Statistical Modeling', level: 84 },
  { name: 'NLP / LLMs', level: 80 },
];
const TOOLS = ['Python', 'R', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Tableau', 'Git', 'Linux', 'SPSS', 'LangChain', 'ArcGIS'];
const EXPERIENCE = [
  {
    period: '2023 — PRESENT', role: 'AI Expert in Climate Change', company: 'Expertise France',
    bullets: ['Developing AI-powered data systems for climate policy analytics', 'Providing ML-driven sustainability solutions', 'Supporting evidence-based decision-making across the Global South']
  },
  {
    period: '2022 — PRESENT', role: 'Executive Director — Cairo Branch', company: 'EMAM Organization', type: 'FULL-TIME', link: 'https://www.emamngo.com',
    bullets: ['Leading strategic programs in climate advocacy and AI', 'UNFCCC Designated Contact Person — representing Egypt at COP', 'Managing multi-stakeholder climate project portfolios']
  },
  {
    period: '2023 — PRESENT', role: 'Founder & AI Strategist', company: 'MZ for Tech Solutions', type: 'FOUNDER',
    bullets: ['Building AI-first technology solutions for social impact', 'Leading product development across climate, governance, analytics', 'Bridging AI innovation and real-world implementation']
  },
  {
    period: '2022 — 2023', role: 'Researcher & AI Trainer', company: 'Cairo University', type: 'ACADEMIC',
    bullets: ['Research in AI applications for public policy', 'AI literacy training programs and workshops', 'Co-authored publications on climate diplomacy and data science']
  },
];
const STATS = [{ value: 5, suffix: '+', label: 'YRS_EXPERIENCE' }, { value: 10, suffix: '+', label: 'PROJECTS' }, { value: 3, suffix: '+', label: 'PUBLICATIONS' }, { value: 2, suffix: '', label: 'ORGS_FOUNDED' }];
const LANGS = [{ lang: 'Arabic', level: 'NATIVE', pct: 100 }, { lang: 'English', level: 'FLUENT', pct: 90 }];
const PUBS = [
  { title: 'AI For Ocean Conservation', venue: 'ResearchGate DOI:10.13140/RG.2.2.33176.51208', href: 'http://dx.doi.org/10.13140/RG.2.2.33176.51208' },
  { title: 'E-Government in Egypt', venue: 'Working Paper — Egypt Vision 2030', href: 'https://mo-elsamahy.github.io/Website/pdfs/E-Government.pdf' },
  { title: 'Database Management Systems', venue: 'Academic — Cairo University', href: 'https://mo-elsamahy.github.io/Website/pdfs/Database%20Management%20Systems%20Project.pdf' },
];

// ─── TERMINAL AGENT COMMANDS ──────────────────────────────────────────────────
type TLine = { text: string; color?: string; vt?: boolean };
const AGENT_COMMANDS: Record<string, TLine[]> = {
  help: [
    { text: '╔══ MAIN NAVIGATION ═════════════════════════╗', color: '#00e639' },
    { text: '║  about       reveal bio & education        ║', color: '#ccf0cc' },
    { text: '║  company     reveal MZ Tech info           ║', color: '#ccf0cc' },
    { text: '║  skills      reveal technical skills       ║', color: '#ccf0cc' },
    { text: '║  exp         reveal work experience        ║', color: '#ccf0cc' },
    { text: '║  contact     reveal contact information    ║', color: '#ccf0cc' },
    { text: '╚════════════════════════════════════════════╝', color: '#00e639' },
    { text: '╔══ QUICK COMMANDS ══════════════════════════╗', color: '#00e639' },
    { text: '║  whoami      fast profile overview         ║', color: '#ccf0cc' },
    { text: '║  neofetch    system info card              ║', color: '#ccf0cc' },
    { text: '║  ls          list portfolio files          ║', color: '#ccf0cc' },
    { text: '║  status      check availability            ║', color: '#ccf0cc' },
    { text: '║  clear       clear terminal                ║', color: '#ccf0cc' },
    { text: '╚════════════════════════════════════════════╝', color: '#00e639' },
    { text: '  TIP: Type a navigation command to render the section below.', color: '#ffb830' },
  ],
  whoami: [
    { text: 'Mohamed Amir Elsamahy', color: '#00e639', vt: true },
    { text: 'AI Specialist  ·  Data Scientist  ·  Founder', color: '#29d4ff' },
    { text: '─────────────────────────────────────────────', color: '#004d18' },
    { text: '› AI Engineer building data-driven solutions', color: '#ccf0cc' },
    { text: '› Founder of MZ for Tech Solutions (2023)', color: '#ccf0cc' },
    { text: '› Executive Director @ EMAM Organization', color: '#ccf0cc' },
    { text: '› UNFCCC Climate Negotiator — Egypt COP', color: '#ccf0cc' },
    { text: '› 5+ years · 3 publications · 10+ projects', color: '#4a7a4a' },
  ],
  neofetch: [
    { text: '', color: '' },
    { text: '   ███╗   ███╗███████╗       Mohamed Amir Elsamahy', color: '#00e639' },
    { text: '   ████╗ ████║╚══███╔╝       ─────────────────────────────', color: '#00e639' },
    { text: '   ██╔████╔██║  ███╔╝        OS      MZ-OS v2.0.26', color: '#00e639' },
    { text: '   ██║╚██╔╝██║ ███╔╝         Role    AI Specialist & Founder', color: '#00e639' },
    { text: '   ██║ ╚═╝ ██║███████╗       Company MZ for Tech Solutions', color: '#00e639' },
    { text: '   ╚═╝     ╚═╝╚══════╝       Loc     Cairo, Egypt 🇪🇬', color: '#00e639' },
    { text: '                             GitHub  mo-elsamahy', color: '#29d4ff' },
    { text: '                             Status  ● ONLINE', color: '#29d4ff' },
    { text: '                             Uptime  5+ years', color: '#29d4ff' },
    { text: '', color: '' },
    { text: '   ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██', color: '#00e639' },
  ],
  skills: [
    { text: 'Rendering Skills section below... [OK]', color: '#39ff6e' },
  ],
  exp: [
    { text: 'Rendering Experience section below... [OK]', color: '#39ff6e' },
  ],
  experience: [
    { text: 'Rendering Experience section below... [OK]', color: '#39ff6e' },
  ],
  about: [
    { text: 'Rendering About section below... [OK]', color: '#39ff6e' },
  ],
  company: [
    { text: 'Rendering Company section below... [OK]', color: '#39ff6e' },
  ],
  contact: [
    { text: 'Rendering Contact section below... [OK]', color: '#39ff6e' },
  ],
  ls: [
    { text: 'drwxr-xr-x  experience/       5+ years of AI work history', color: '#00e639' },
    { text: 'drwxr-xr-x  skills/           Python · R · TF · LangChain', color: '#00e639' },
    { text: 'drwxr-xr-x  publications/     3 research papers', color: '#00e639' },
    { text: 'drwxr-xr-x  organizations/    MZ Tech · EMAM NGO', color: '#00e639' },
    { text: '-rw-r--r--  about.txt         AI Specialist & Founder', color: '#ccf0cc' },
    { text: '-rw-r--r--  contact.cfg       Always open for collaboration', color: '#ccf0cc' },
    { text: '-rwxr-xr-x  MZ_Tech.exe       Founded 2023 · Status: RUNNING', color: '#ccf0cc' },
    { text: '-rwxr-xr-x  portfolio.exe     Type "projects" — coming soon', color: '#4a7a4a' },
  ],
  status: [
    { text: '● SYSTEM STATUS — 2026-03-10', color: '#00e639' },
    { text: '', color: '' },
    { text: '  AI Consulting          OPEN', color: '#00e639' },
    { text: '  Speaking Engagements   OPEN', color: '#00e639' },
    { text: '  Research Collaboration OPEN', color: '#00e639' },
    { text: '  Climate Tech Projects  OPEN', color: '#00e639' },
    { text: '  Full-Time Employment   REVIEWING', color: '#ffb830' },
  ],
  coffee: [
    { text: 'Brewing...', color: '#ffb830' },
    { text: '', color: '' },
    { text: '  ( (      ╔════════════════════════╗', color: '#ffb830' },
    { text: '   ) )     ║  LOADING CREATIVITY... ║', color: '#ffb830' },
    { text: ' ........ ╚════════════════════════╝', color: '#ffb830' },
    { text: ' |      |]', color: '#ffb830' },
    { text: ' \\      /', color: '#ffb830' },
    { text: "  `----'   Coffee loaded. Ready to build.", color: '#00e639' },
  ],
  matrix: [
    { text: '01001101 01111010  01010100 01100101 01100011 01101000', color: '#004d18' },
    { text: '10110100 01000001 01001001 00100000 01010011 01110000', color: '#00b32d' },
    { text: '11001010 01100101 01100011 01101001 01100001 01101100', color: '#00e639' },
    { text: '01101001 01110011 01110100 00100000 01001101 01101111', color: '#39ff6e' },
    { text: 'DECODED: MZ Tech · AI Specialist — Mohamed Amir', color: '#29d4ff' },
  ],
  sudo: [{ text: '[sudo] password for visitor: ', color: '#ffb830' }, { text: 'Permission denied. This system is secured by MZ-OS.', color: '#ff4444' }],
  'rm -rf /': [{ text: 'Nice try. System protected.  — MZ-OS Security Module v2.0', color: '#ff4444' }],
  ai: [
    { text: '[ AI CAPABILITIES & INTERESTS ]', color: '#ffb830' },
    { text: '  · Machine Learning & Deep Learning', color: '#00e639' },
    { text: '  · Large Language Models (LLMs) & LangChain', color: '#00e639' },
    { text: '  · Climate AI & Environmental Data Science', color: '#00e639' },
    { text: '  · Statistical Modeling & Inference', color: '#00e639' },
    { text: '  · AI for Public Policy & Governance', color: '#00e639' },
    { text: '  · NLP & Text Analytics', color: '#00e639' },
  ],
  projects: [
    { text: '[ PROJECTS — Loading... ]', color: '#ffb830' },
    { text: '  Portfolio section coming soon.', color: '#4a7a4a' },
    { text: '  Message me directly for a full project list.', color: '#4a7a4a' },
    { text: '  EMAIL: mohamed.amir2022@feps.edu.eg', color: '#29d4ff' },
  ],
};
const UNKNOWN_CMD = (cmd: string): TLine[] => [
  { text: `Command not found: ${cmd}`, color: '#ff4444' },
  { text: `Type 'help' to see available commands.`, color: '#4a7a4a' },
];


// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function MatrixRain() {
  const cvs = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオ<>{}[]=+-';
    const fs = 13;
    const drops: number[] = Array(Math.floor(canvas.width / fs)).fill(1);

    let raf: number;
    let lastTime = 0;
    const targetFps = 30; // 30fps is optimal and saves battery
    const interval = 1000 / targetFps;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const deltaTime = time - lastTime;
      if (deltaTime < interval) return;
      lastTime = time - (deltaTime % interval);

      ctx.fillStyle = 'rgba(5, 13, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fs}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const b = Math.random();
        ctx.fillStyle = b > .95 ? '#39ff6e' : b > .7 ? '#00e639' : '#004d18';
        ctx.shadowBlur = b > .95 ? 8 : 0;
        ctx.shadowColor = '#00e639';
        ctx.fillText(char, i * fs, drops[i] * fs);
        if (drops[i] * fs > canvas.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cvs} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.18, pointerEvents: 'none', zIndex: 0, willChange: 'transform' }} />;
}

function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null), dot = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const mv = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      }
    };
    const on = () => ring.current?.classList.add('hovered');
    const off = () => ring.current?.classList.remove('hovered');

    document.addEventListener('mousemove', mv, { passive: true });
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('tool-tag')) {
        on();
      }
    });
    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('tool-tag')) {
        off();
      }
    });

    let raf: number;
    let ringX = -100, ringY = -100;

    const loop = () => {
      const dx = pos.current.x - ringX;
      const dy = pos.current.y - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;
      if (ring.current && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        ring.current.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => { document.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" style={{ top: 0, left: 0, willChange: 'transform, width, height' }} />
      <div ref={dot} className="cursor-dot" style={{ top: 0, left: 0, willChange: 'transform' }} />
    </>
  );
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          setV(Math.floor(value));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, target]);

  return <div ref={ref} className="stat-number">{v}{suffix}</div>;
}

function SkillBars() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      {SKILLS.map((s, i) => (
        <div key={s.name} className="skill-row" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="skill-meta">
            <span className="skill-name">{s.name}</span>
            <span className="skill-pct">{s.level}%</span>
          </div>
          <div className="skill-track">
            <motion.div
              className="skill-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${s.level}%` }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ willChange: 'width' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FadeIn({ id, children, delay = 0 }: { id?: string; children: React.ReactNode; delay?: number }) {
  return (
    <section id={id}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.7, delay: delay / 1000, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function TermWin({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="terminal-window"><div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'linear-gradient(110deg,transparent 35%,rgba(0,230,57,0.04) 50%,transparent 65%)', animation: 'shimmer 5s ease-in-out infinite', willChange: 'transform' }} /><div className="terminal-header"><span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" /><span className="terminal-title">{title}</span></div><div className="terminal-body" style={{ position: 'relative', zIndex: 1 }}>{children}</div></div>);
}

function Prompt({ cmd }: { cmd: string }) { return (<div className="prompt-line"><span className="prompt-path">C:\USERS\VISITOR</span><span className="prompt-arrow"> &gt; </span><span className="prompt-cmd">{cmd}</span></div>); }

function Nav({ activeSections, onCommand }: { activeSections: string[], onCommand: (cmd: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, s: string) => {
    e.preventDefault();
    setOpen(false);
    onCommand((s === 'experience') ? 'exp' : s);
  };

  return (
    <nav className="nav-fixed">
      <div className="nav-inner">
        <span className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>M.A.E_</span>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {['about', 'company', 'skills', 'experience', 'contact'].map(s => (
            <li key={s}>
              <a href={`#${s}`} onClick={(e) => handleClick(e, s)} style={{ color: activeSections.includes(s) ? 'var(--green-bright)' : 'var(--gray)' }}>
                {s.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
        <button className="nav-toggle" onClick={() => setOpen(o => !o)}>{open ? '[ X ]' : '[ ≡ ]'}</button>
      </div>
    </nav>
  );
}

// ─── INTERACTIVE AGENT TERMINAL ───────────────────────────────────────────────

const TermLine = React.memo(({ l }: { l: TLine & { isCmd?: boolean } }) => {
  if (!l) return null;
  return (
    <div style={{
      color: l.color || 'transparent',
      fontFamily: l.vt ? 'var(--font-vt)' : 'var(--font-mono)',
      fontSize: l.vt ? 26 : 13,
      background: l.isCmd ? 'rgba(0,230,57,0.04)' : 'transparent',
      padding: l.isCmd ? '1px 6px' : 0,
      borderRadius: l.isCmd ? 2 : 0,
      whiteSpace: 'pre',
    }}>
      {l.text || '\u00a0'}
    </div>
  );
});
TermLine.displayName = 'TermLine';

function AgentTerminal({ onCommand, isTouring, onTourReady, onTourEnd }: { onCommand: (cmd: string, preventScroll?: boolean) => void, isTouring: boolean, onTourReady: () => void, onTourEnd: () => void }) {
  const [lines, setLines] = useState<(TLine & { isCmd?: boolean })[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(true);
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLines = useCallback((newLines: TLine[], delay = 35) => {
    return new Promise<void>(resolve => {
      if (!newLines || newLines.length === 0) return resolve();
      let i = 0;
      const push = () => {
        if (newLines[i]) {
          setLines(prev => {
            const next = [...prev, newLines[i]];
            if (next.length > 150) return next.slice(next.length - 150);
            return next;
          });
        }
        i++;
        if (i < newLines.length) setTimeout(push, delay);
        else resolve();
      };
      setTimeout(push, Math.max(delay, 20));
    });
  }, []);

  const run = useCallback(async (cmd: string, preventScroll = false) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    setBusy(true);
    setLines(prev => [...prev, { text: `C:\\AGENT> ${cmd}`, isCmd: true, color: '#ccf0cc' }]);

    // Pass command up to parent to handle section rendering
    onCommand(c, preventScroll);

    await new Promise(r => setTimeout(r, 180));
    if (c === 'clear') { setLines([]); setBusy(false); return; }
    const output = AGENT_COMMANDS[c] ?? UNKNOWN_CMD(cmd);
    await addLines(output, 20);
    setLines(prev => [...prev, { text: '', color: '' }]);
    setBusy(false);
  }, [addLines, onCommand]);

  // Auto-demo on mount
  const demoRun = useRef(false);

  useEffect(() => {
    if (!demoRun.current) {
      demoRun.current = true;
      (async () => {
        await new Promise(r => setTimeout(r, 400));
        await addLines([
          { text: '╔════════════════════════════════════════════╗', color: '#004d18' },
          { text: '║   MZ AGENT v1.0  —  Responsive Engine      ║', color: '#00e639' },
          { text: '║   Type "help" to see available commands    ║', color: '#4a7a4a' },
          { text: '╚════════════════════════════════════════════╝', color: '#004d18' },
          { text: '', color: '' },
        ], 15);
        await new Promise(r => setTimeout(r, 300));
        await run('about', true);
        await new Promise(r => setTimeout(r, 300));
        await addLines([{ text: '>>> Terminal unlocks the site. Type a command to reveal sections.', color: '#ffb830' }], 15);
        setBusy(false);
        // Show cinematic tour guide after boot
        setTimeout(() => onTourReady(), 1200);
      })();
    }
  }, [addLines, run, onTourReady]);

  // Fix: Target scroll to just the container, preventing the whole page from jumping down
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !input.trim()) return;
    setHist(h => [input, ...h.slice(0, 19)]);
    setHIdx(-1);
    if (isTouring) onTourEnd();
    run(input);
    setInput('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') { const i = Math.min(hIdx + 1, hist.length - 1); setHIdx(i); setInput(hist[i] ?? ''); e.preventDefault(); }
    if (e.key === 'ArrowDown') { const i = Math.max(hIdx - 1, -1); setHIdx(i); setInput(i === -1 ? '' : hist[i] ?? ''); e.preventDefault(); }
  };

  return (
    <>
      <div style={{
        border: isTouring ? '1px solid #39ff6e' : '1px solid rgba(0,230,57,0.3)', borderRadius: 8, background: '#0c170c',
        position: 'relative', overflow: 'hidden',
        boxShadow: isTouring
          ? '0 0 0 9999px rgba(2,6,2,0.85), 0 0 80px rgba(0,230,57,0.5), inset 0 0 40px rgba(0,0,0,0.5)'
          : '0 0 60px rgba(0,230,57,0.08), inset 0 0 40px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', height: '100%', minHeight: 460,
        zIndex: isTouring ? 9999 : 1, transition: 'box-shadow 0.8s ease'
      }}>
        {/* Dynamic scanline layer */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '100%', height: 1,
          background: 'linear-gradient(90deg,transparent,#00e639,transparent)',
          animation: 'scanRight 3s linear infinite', zIndex: 2, pointerEvents: 'none', willChange: 'transform'
        }} />

        <div className="terminal-header" style={{ background: 'rgba(0,230,57,0.04)', zIndex: 1, position: 'relative' }}>
          <span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" />
          <span className="terminal-title">MZ AGENT v1.0 — CORE INTERFACE</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#00e639', letterSpacing: 2 }}>● SYSTEM CONTROL</span>
        </div>

        <div ref={scrollRef} onClick={() => inputRef.current?.focus()}
          style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.75, cursor: 'text' }}>
          {lines.map((l, i) => (
            <TermLine key={i} l={l} />
          ))}
          {busy && <span style={{ color: '#00e639', animation: 'blink 1s step-end infinite' }}>█</span>}
        </div>

        <form onSubmit={submit}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '16px 24px', borderTop: '1px solid rgba(0,230,57,0.12)',
            background: 'rgba(0,230,57,0.05)'
          }}>
          <span style={{ color: '#00e639', fontFamily: 'var(--font-mono)', fontSize: 14, flexShrink: 0 }}>
            C:\AGENT&gt;
          </span>
          <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => { if (isTouring) onTourEnd() }}
              disabled={busy}
              placeholder={busy ? 'System Processing...' : "Type a navigation command (e.g. skills, contact)"}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#ccf0cc', fontFamily: 'var(--font-mono)', fontSize: 14,
                caretColor: '#00e639', width: '100%'
              }}
            />
          </div>
          <button type="submit" disabled={busy}
            style={{
              background: 'rgba(0,230,57,0.1)', border: '1px solid rgba(0,230,57,0.3)',
              color: '#00e639', fontFamily: 'var(--font-mono)', fontSize: 11,
              padding: '6px 16px', borderRadius: 3, cursor: 'pointer', letterSpacing: 1,
              transition: 'all 0.2s'
            }}>
            ENTER
          </button>
        </form>
      </div>

      {/* Cinematic Tour Guide Panel */}
      {isTouring && (
        <div style={{
          position: 'fixed', left: 'max(4vw, calc(50vw - 480px))', top: '50%', transform: 'translateY(-50%)',
          width: 'min(92vw, 420px)', zIndex: 10000, pointerEvents: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: 'rgba(5, 15, 5, 0.85)', border: '1px solid rgba(0,230,57,0.5)',
              padding: 32, borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,230,57,0.1)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="section-tag" style={{ marginBottom: 16, background: 'var(--green)', color: '#000', padding: '4px 10px', display: 'inline-block' }}>SYSTEM ENTRUSTED</div>
            <h2 style={{ fontSize: 28, color: '#fff', marginBottom: 12, fontFamily: 'var(--font-vt)' }}>MZ-OS GUEST MODE</h2>
            <p style={{ color: 'var(--gray)', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
              Welcome to the interactive portfolio command center.<br /><br />
              To unlock the system and view the creator&apos;s digital footprint, you must interface with the highlighted terminal.
            </p>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: 1, marginBottom: 12 }}>SUGGESTED COMMANDS:</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { onTourEnd(); run('skills'); }} className="hero-btn" style={{ padding: '10px 16px', fontSize: 13, flex: 1, justifyContent: 'center' }}>› skills</button>
                <button onClick={() => { onTourEnd(); run('contact'); }} className="hero-btn" style={{ padding: '10px 16px', fontSize: 13, flex: 1, justifyContent: 'center' }}>› contact</button>
              </div>
            </div>
            <button onClick={() => { onTourEnd(); inputRef.current?.focus(); }} style={{
              width: '100%', padding: '14px', background: 'var(--green)', color: '#000',
              border: 'none', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 'bold', cursor: 'pointer',
              letterSpacing: 2, transition: 'all 0.2s', textTransform: 'uppercase'
            }}>
              [ CLICK TO HACK IN ]
            </button>
          </motion.div>
          {/* Glow arrow pointing to terminal */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
            style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', width: 40, height: 2, background: 'var(--green)' }}>
            <div style={{ position: 'absolute', right: 0, top: -5, width: 12, height: 12, borderTop: '2px solid var(--green)', borderRight: '2px solid var(--green)', transform: 'rotate(45deg)' }} />
          </motion.div>
        </div>
      )}
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [booted, setBooted] = useState(false);
  const [bootN, setBootN] = useState(0);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [isTouring, setIsTouring] = useState(false);

  // Commands map to section IDs
  const handleCommand = useCallback((cmd: string, preventScroll = false) => {
    const map: Record<string, string> = {
      about: 'about', company: 'company', skills: 'skills',
      exp: 'experience', experience: 'experience', contact: 'contact'
    };
    if (map[cmd]) {
      const sec = map[cmd];
      setActiveSections(prev => prev.includes(sec) ? prev : [...prev, sec]);
      // Small delay to allow CSS reflow then smooth scroll
      if (!preventScroll) {
        setTimeout(() => {
          document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  const getSectionClass = (id: string) =>
    activeSections.includes(id) ? "section-active" : "section-hidden";

  // Hook boot screen to run EVERY TIME (Removed sessionStorage limitation)
  useEffect(() => {
    if (!booted) {
      if (bootN < BOOT_LINES.length) {
        const t = setTimeout(() => setBootN(v => v + 1), 140);
        return () => clearTimeout(t);
      }
      else {
        const t = setTimeout(() => {
          setBooted(true);
        }, 500);
        return () => clearTimeout(t);
      }
    }
  }, [booted, bootN]);

  return (
    <>
      {booted && <MatrixRain />}
      <CustomCursor />

      {/* Boot */}
      {!booted && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 640, padding: '0 32px' }}>
            {BOOT_LINES.slice(0, bootN).map((l, i) => (
              <span key={i} className="boot-line" style={{ color: l.color || 'transparent', animationDelay: `${i * 0.05}s`, fontFamily: 'var(--font-mono)' }}>{l.text || '\u00a0'}</span>
            ))}
            {bootN === BOOT_LINES.length && <span className="cursor" />}
            <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: 220, height: 2, background: 'var(--green-muted)', borderRadius: 1 }}>
              <div style={{ height: '100%', background: 'var(--green)', borderRadius: 1, boxShadow: '0 0 10px var(--green)', width: `${Math.round((bootN / BOOT_LINES.length) * 100)}%`, transition: 'width 0.14s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Wait until booted so transitions don't fight initial mounting */}
      <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.9s ease', position: 'relative', zIndex: 1 }}>
        <Nav activeSections={activeSections} onCommand={handleCommand} />

        {/* ── SPLIT-SCREEN HERO (WOW FACTOR) ── */}
        <section id="top" style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', alignItems: 'center', paddingTop: 52, paddingBottom: 52, position: 'relative', overflow: isTouring ? 'visible' : 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,230,57,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,57,0.055) 1px,transparent 1px)', backgroundSize: '72px 72px', zIndex: 0 }} />
          {[{ top: '-10%', left: '-5%', size: 500, c: 'rgba(0,230,57,0.06)' }, { top: '60%', right: '-5%', size: 400, c: 'rgba(41,212,255,0.05)' }, { top: '30%', left: '40%', size: 300, c: 'rgba(0,230,57,0.04)' }].map((o, i) => (
            <div key={i} aria-hidden style={{ position: 'absolute', borderRadius: '50%', width: o.size, height: o.size, background: `radial-gradient(circle,${o.c},transparent 70%)`, top: o.top, ...(o as { left?: string; right?: string }), animation: `floatY ${5 + i * 2}s ease-in-out ${i}s infinite`, pointerEvents: 'none', zIndex: 0, willChange: 'transform' }} />
          ))}
          {[...Array(14)].map((_, i) => (
            <div key={i} aria-hidden style={{ position: 'absolute', left: `${5 + i * 7}%`, bottom: `${8 + (i % 5) * 14}%`, width: i % 4 === 0 ? 4 : 2, height: i % 4 === 0 ? 4 : 2, borderRadius: '50%', background: i % 3 === 0 ? 'var(--cyan)' : 'var(--green)', boxShadow: `0 0 8px ${i % 3 === 0 ? 'var(--cyan)' : 'var(--green)'}`, opacity: 0.35, animation: `particleRise ${3 + (i % 4)}s ease-in-out ${i * 0.35}s infinite`, pointerEvents: 'none', zIndex: 0, willChange: 'transform' }} />
          ))}

          <div className="container hero-grid" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            {/* HERO LEFT: PROFILE & STATS */}
            <div className="hero-left" style={{ opacity: isTouring ? 0.4 : 1, transition: 'opacity 0.8s ease', pointerEvents: isTouring ? 'none' : 'auto' }}>
              <TermWin title="TERMINAL — C:\\USERS\\AMIR\\PORTFOLIO.EXE">
                <>
                  <Prompt cmd="whoami --full --verbose" />
                  <div style={{ marginBottom: 16, color: 'rgba(0,230,57,0.25)', fontSize: 11, letterSpacing: 4, userSelect: 'none' }}>════════════════════════════════════════════</div>
                  <h1 className="glitch neon-heading" data-text="Mohamed Amir Elsamahy"
                    style={{ fontSize: 'clamp(32px,6vw,56px)', marginBottom: 14, letterSpacing: 3, fontFamily: 'var(--font-vt)' }}>
                    Mohamed Amir Elsamahy
                  </h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 0', marginBottom: 22 }}>
                    <span style={{ fontFamily: 'var(--font-vt)', fontSize: 24, letterSpacing: 2, color: 'var(--cyan)', textShadow: '0 0 14px rgba(41,212,255,0.6)' }}>AI Specialist</span>
                    <span style={{ color: 'var(--green-muted)', margin: '0 16px' }}>|</span>
                    <span style={{ color: 'var(--white)', fontSize: 13 }}>Data Scientist</span>
                    <span style={{ color: 'var(--green-muted)', margin: '0 16px' }}>|</span>
                    <span style={{ color: 'var(--amber)', fontSize: 13, textShadow: '0 0 10px rgba(255,184,48,0.5)' }}>Founder</span>
                  </div>
                  <p style={{ maxWidth: 600, fontSize: 13.5, color: 'var(--gray)', marginBottom: 28, lineHeight: 1.8 }}>
                    <span style={{ color: 'var(--green)' }}>&gt;&nbsp;</span>
                    AI Engineer &amp; Data Scientist at the intersection of machine learning, climate policy, and social innovation.
                    Founder of <strong>MZ for Tech Solutions</strong>. Executive Director at <strong>EMAM Organization</strong>.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
                    {[{ label: '[ LinkedIn ]', href: 'https://www.linkedin.com/in/mohamedaelsamahy' }, { label: '[ GitHub ]', href: 'https://github.com/mo-elsamahy' }, { label: '[ Email ]', href: 'mailto:mohamed.amir2022@feps.edu.eg' }].map(l => (
                      <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hero-btn">{l.label}</a>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', flexWrap: 'wrap', gap: '5px 22px' }}>
                    <span><span style={{ color: 'var(--green)' }}>LOC:</span> Cairo, Egypt</span>
                    <span><span style={{ color: 'var(--green)' }}>NET:</span> ONLINE <span className="cursor" /></span>
                  </div>
                </>
              </TermWin>
              <div className="stat-grid" style={{ marginTop: 20 }}>
                {STATS.map((s, i) => (<motion.div key={s.label} className="stat-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1), duration: 0.6 }}><Counter target={s.value} suffix={s.suffix} /><div className="stat-label">{s.label}</div></motion.div>))}
              </div>
            </div>

            {/* HERO RIGHT: TERMINAL ENGINE (DESKTOP ONLY) */}
            <div className="hero-right desktop-only" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <AgentTerminal onCommand={handleCommand} isTouring={isTouring} onTourReady={() => setIsTouring(true)} onTourEnd={() => setIsTouring(false)} />
              <div style={{ marginTop: 18, fontSize: 12, color: 'var(--green-dim)', textAlign: 'center', letterSpacing: 1 }}>
                  {/* // AWAITING USER COMMAND // */}
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <div className={getSectionClass('about')}>
          <FadeIn id="about">
            <div className="container">
              <Prompt cmd="cat about.txt" />
              <TermWin title="about.txt">
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 36 }} className="two-col">
                  <div>
                    <div className="section-tag">SYS_PROFILE</div>
                    <h2 style={{ fontSize: 48, marginBottom: 20 }}>ABOUT.EXE</h2>
                    <p style={{ marginBottom: 16 }}>I&apos;m Mohamed Amir Elsamahy — an AI Specialist and Data Scientist from Cairo, Egypt. My work sits at the crossroads of artificial intelligence, climate policy, and data-driven public governance.</p>
                    <p style={{ marginBottom: 16 }}>As Founder of <strong>MZ for Tech Solutions</strong>, I lead AI product strategy for social impact sectors. As Executive Director at <strong>EMAM Organization</strong>, I serve as Egypt&apos;s UNFCCC Designated Contact Person.</p>
                    <p>Cairo University background gives me a unique lens — combining rigorous statistical methods with real-world policy understanding and AI engineering.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="ascii-box" data-label="[ EDUCATION ]">
                      <div style={{ color: 'var(--amber)', fontSize: 11, letterSpacing: 3, marginBottom: 6 }}>2019 — 2023</div>
                      <div style={{ fontFamily: 'var(--font-vt)', fontSize: 22, color: 'var(--green)', marginBottom: 4 }}>B.Sc. Statistics &amp; Computer Science</div>
                      <div style={{ fontSize: 12.5, color: 'var(--cyan)', marginBottom: 8 }}>Cairo University — Economics &amp; Political Science</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)', fontStyle: 'italic' }}>Graduation Project: Applied Statistics in AI — reducing model parameters while maintaining efficiency</div>
                    </div>
                    <div className="ascii-box" data-label="[ PUBLICATIONS ]">
                      {PUBS.map(p => (<div key={p.title} style={{ marginBottom: 14 }}><a href={p.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500 }}>▸ {p.title}</a><div style={{ fontSize: 11.5, color: 'var(--gray)', marginTop: 3 }}>{p.venue}</div></div>))}
                    </div>
                  </div>
                </div>
              </TermWin>
            </div>
          </FadeIn>
        </div>

        {/* ── COMPANY ── */}
        <div className={getSectionClass('company')}>
          <FadeIn id="company">
            <div className="container">
              <Prompt cmd="./company --full-report MZ_TECH_SOLUTIONS" />
              <div className="company-card">
                <span className="card-corner tl" /><span className="card-corner tr" /><span className="card-corner bl" /><span className="card-corner br" />
                <div className="logo-frame">
                  <Image src="/logos/MZ.png" alt="MZ for Tech Solutions" width={80} height={80} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 14px rgba(0,230,57,0.6))' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="section-tag" style={{ marginBottom: 12 }}>FOUNDED_ENTITY</div>
                  <h2 style={{ fontSize: 52, letterSpacing: 5, marginBottom: 10 }}>MZ FOR TECH SOLUTIONS</h2>
                  <p style={{ fontSize: 13, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 20 }}>AI-First Technology Company &mdash; Cairo, Egypt</p>
                  <p style={{ fontSize: 13.5, color: 'var(--gray)', maxWidth: 560, marginBottom: 24, lineHeight: 1.9 }}>Delivering intelligent technology products and consulting for social impact sectors — AI systems, data pipelines, and analytics platforms across climate tech, public governance, and enterprise AI.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px' }}>
                    {['AI Product Development', 'Climate Data Analytics', 'AI Consulting & Training', 'ML System Architecture'].map(s => (<span key={s} style={{ fontSize: 12.5, color: 'var(--gray)' }}><span style={{ color: 'var(--green)' }}>▸ </span>{s}</span>))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── SKILLS ── */}
        <div className={getSectionClass('skills')}>
          <FadeIn id="skills">
            <div className="container">
              <Prompt cmd="SKILLS.EXE --benchmark --display-all" />
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }} className="two-col">
                <TermWin title="skill_matrix.dat — LIVE">
                  <div className="section-tag" style={{ marginBottom: 24 }}>CORE_COMPETENCIES</div>
                  <SkillBars />
                </TermWin>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="ascii-box" data-label="[ TOOLS & STACK ]">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{TOOLS.map(t => <span key={t} className="tool-tag">{t}</span>)}</div>
                  </div>
                  <div className="ascii-box" data-label="[ LANGUAGES ]">
                    {LANGS.map(l => (<div key={l.lang} style={{ marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}><span style={{ fontSize: 13 }}>{l.lang}</span><span style={{ fontSize: 10, color: 'var(--amber)', letterSpacing: 2, fontWeight: 600 }}>{l.level}</span></div><div className="lang-bar-track"><motion.div className="lang-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${l.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} style={{ willChange: 'width' }} /></div></div>))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── EXPERIENCE ── */}
        <div className={getSectionClass('experience')}>
          <FadeIn id="experience">
            <div className="container">
              <Prompt cmd="cat experience.log | sort -r" />
              <TermWin title={`experience.log — ${EXPERIENCE.length} ENTRIES`}>
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className="log-entry">
                    <div className="log-timestamp">{exp.period}</div>
                    <div className="log-role">{exp.role}</div>
                    <div className="log-company">
                      {'type' in exp && exp.type && <span className="log-type">{exp.type}</span>}
                      {'link' in exp && exp.link ? <a href={exp.link} target="_blank" rel="noopener noreferrer">{exp.company}</a> : exp.company}
                    </div>
                    <div>{exp.bullets.map((b, bi) => <div key={bi} className="log-bullet">{b}</div>)}</div>
                  </div>
                ))}
              </TermWin>
            </div>
          </FadeIn>
        </div>

        {/* ── CONTACT ── */}
        <div className={getSectionClass('contact')}>
          <FadeIn id="contact">
            <div className="container">
              <Prompt cmd="./contact.bat --open-session" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="two-col">
                <TermWin title="CONTACT SESSION OPEN">
                  <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 24, lineHeight: 1.9 }}><span style={{ color: 'var(--green)' }}>&gt;</span> Ready to collaborate on AI, climate tech, or consulting. Response time: <strong>24–48 hrs</strong>.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[{ icon: '@', label: 'EMAIL', text: 'mohamed.amir2022@feps.edu.eg', href: 'mailto:mohamed.amir2022@feps.edu.eg' }, { icon: 'in', label: 'LINKEDIN', text: '/in/mohamedaelsamahy', href: 'https://www.linkedin.com/in/mohamedaelsamahy' }, { icon: '</>', label: 'GITHUB', text: 'github.com/mo-elsamahy', href: 'https://github.com/mo-elsamahy' }, { icon: '#', label: 'PHONE', text: '+20 111 987 0082', href: 'tel:+201119870082' }].map(c => (
                      <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact-link">
                        <span className="contact-icon">{c.icon}</span>
                        <div><div className="contact-sub">{c.label}</div><div>{c.text}</div></div>
                      </a>
                    ))}
                  </div>
                </TermWin>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="ascii-box" data-label="[ AVAILABILITY ]">
                    {[{ type: 'AI Consulting', status: 'OPEN', cls: 'status-open' }, { type: 'Speaking Engagements', status: 'OPEN', cls: 'status-open' }, { type: 'Research Collaboration', status: 'OPEN', cls: 'status-open' }, { type: 'Climate Tech Projects', status: 'OPEN', cls: 'status-open' }, { type: 'Full-Time Employment', status: 'REVIEWING', cls: 'status-review' }].map(a => (<div key={a.type} className="avail-row"><span>{a.type}</span><span className={`status-badge ${a.cls}`}>{a.status}</span></div>))}
                  </div>
                  <div className="ascii-box" data-label="[ FOCUS AREAS ]">
                    {['Artificial Intelligence & LLMs', 'Machine Learning for Climate', 'Data Science & Visualization', 'AI Policy & Governance', 'NGO Digital Transformation', 'Sustainable Development Tech'].map((f, i) => (<div key={f} className="focus-item"><span className="focus-num">0{i + 1}.</span>{f}</div>))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <footer className="footer" style={{ marginTop: 40 }}>
          <div className="container">
            <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--green)' }}>©</span> 2026 Mohamed Amir Elsamahy &nbsp;·&nbsp; <span style={{ color: 'var(--green)' }}>MZ</span> for Tech Solutions &nbsp;·&nbsp; Cairo, Egypt</div>
            <div style={{ opacity: 0.4, fontSize: 11 }}>MZ-OS v2.0.26 — All systems operational <span className="cursor" /></div>
          </div>
        </footer>
      </div>

      <style>{`
        @media (max-width:680px) { .two-col { grid-template-columns:1fr !important; } }
        .neon-heading { background:linear-gradient(135deg,#00e639 0%,#29d4ff 50%,#39ff6e 100%);background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradMove 5s ease infinite;filter:drop-shadow(0 0 12px rgba(0,230,57,0.5)); }
        @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes particleRise { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-100px) scale(0.5);opacity:0} }
        @keyframes scanRight { from{left:-100%} to{left:100%} }
        @keyframes shimmer { from{transform:translateX(-150%)} to{transform:translateX(250%)} }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
      `}</style>
    </>
  );
}
