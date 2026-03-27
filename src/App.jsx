import { useState, useMemo } from 'react';
import './App.css';

const PRESETS = [
  { name: 'Holy Grail', cols: '200px 1fr 200px', rows: '60px 1fr 60px', areas: 'header header header\nsidebar main aside\nfooter footer footer', gap: '8' },
  { name: 'Dashboard', cols: '240px 1fr 1fr', rows: '64px 1fr 1fr', areas: 'nav header header\nnav card1 card2\nnav card3 card4', gap: '12' },
  { name: 'Blog', cols: '1fr 300px', rows: '80px 1fr 60px', areas: 'header header\ncontent sidebar\nfooter footer', gap: '16' },
  { name: '3-Col Equal', cols: '1fr 1fr 1fr', rows: '1fr', areas: 'a b c', gap: '16' },
  { name: 'Card Grid', cols: 'repeat(3, 1fr)', rows: 'repeat(2, 200px)', areas: '. . .\n. . .', gap: '16' },
  { name: 'Full Page', cols: '1fr', rows: '80px 1fr 300px 60px', areas: 'hero\ncontent\nfeatures\nfooter', gap: '0' },
];

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#14b8a6', '#a855f7', '#e11d48', '#84cc16',
];

function parseTemplate(areas) {
  const rows = areas.trim().split('\n').map(r => r.trim().split(/\s+/));
  const names = new Set();
  rows.forEach(r => r.forEach(c => { if (c !== '.') names.add(c); }));
  return { rows, names: [...names] };
}

function generateCSS(cols, rows, gap, areas, containerClass) {
  const lines = [
    `.${containerClass} {`,
    `  display: grid;`,
    `  grid-template-columns: ${cols};`,
    `  grid-template-rows: ${rows};`,
  ];
  if (areas.trim()) {
    const areaRows = areas.trim().split('\n').map(r => `    "${r.trim()}"`);
    lines.push(`  grid-template-areas:`);
    lines.push(areaRows.join('\n') + ';');
  }
  if (gap && gap !== '0') lines.push(`  gap: ${gap}px;`);
  lines.push(`  min-height: 100vh;`);
  lines.push(`}`);

  const { names } = parseTemplate(areas);
  names.forEach(name => {
    lines.push('');
    lines.push(`.${name} {`);
    lines.push(`  grid-area: ${name};`);
    lines.push(`}`);
  });

  return lines.join('\n');
}

function generateHTML(areas, containerClass) {
  const { names } = parseTemplate(areas);
  const lines = [`<div class="${containerClass}">`];
  names.forEach(name => {
    lines.push(`  <div class="${name}">${name}</div>`);
  });
  lines.push(`</div>`);
  return lines.join('\n');
}

export default function App() {
  const [cols, setCols] = useState('200px 1fr 200px');
  const [rows, setRows] = useState('60px 1fr 60px');
  const [gap, setGap] = useState('8');
  const [areas, setAreas] = useState('header header header\nsidebar main aside\nfooter footer footer');
  const [containerClass, setContainerClass] = useState('grid-container');
  const [copied, setCopied] = useState('');
  const [showCode, setShowCode] = useState('css');

  const { names } = useMemo(() => parseTemplate(areas), [areas]);
  const css = useMemo(() => generateCSS(cols, rows, gap, areas, containerClass), [cols, rows, gap, areas, containerClass]);
  const html = useMemo(() => generateHTML(areas, containerClass), [areas, containerClass]);

  const previewStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: cols,
    gridTemplateRows: rows,
    gridTemplateAreas: areas.trim().split('\n').map(r => `"${r.trim()}"`).join(' '),
    gap: `${gap}px`,
    width: '100%',
    height: '100%',
    minHeight: '300px',
  }), [cols, rows, gap, areas]);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const applyPreset = (preset) => {
    setCols(preset.cols);
    setRows(preset.rows);
    setAreas(preset.areas);
    setGap(preset.gap);
  };

  return (
    <div className="app">
      <header>
        <h1><span className="accent">Grid</span>Forge<sup>TM</sup></h1>
        <p className="subtitle">Visual CSS Grid Layout Generator</p>
      </header>

      <div className="layout">
        {/* Controls */}
        <aside className="controls">
          <div className="section">
            <h3>Presets</h3>
            <div className="presets">
              {PRESETS.map(p => (
                <button key={p.name} className="preset-btn" onClick={() => applyPreset(p)}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Grid Definition</h3>
            <label>
              <span>Columns</span>
              <input type="text" value={cols} onChange={e => setCols(e.target.value)} placeholder="1fr 1fr 1fr" />
            </label>
            <label>
              <span>Rows</span>
              <input type="text" value={rows} onChange={e => setRows(e.target.value)} placeholder="auto 1fr auto" />
            </label>
            <label>
              <span>Gap (px)</span>
              <input type="number" value={gap} onChange={e => setGap(e.target.value)} min="0" max="100" />
            </label>
            <label>
              <span>Container Class</span>
              <input type="text" value={containerClass} onChange={e => setContainerClass(e.target.value)} />
            </label>
          </div>

          <div className="section">
            <h3>Template Areas</h3>
            <textarea
              value={areas}
              onChange={e => setAreas(e.target.value)}
              rows={5}
              spellCheck={false}
              placeholder={'header header\nmain sidebar\nfooter footer'}
            />
            <p className="hint">Each row on a new line. Use <code>.</code> for empty cells. Same name = merged area.</p>
          </div>

          <div className="section">
            <h3>Named Areas</h3>
            <div className="area-tags">
              {names.map((name, i) => (
                <span key={name} className="area-tag" style={{ borderColor: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length] }}>
                  {name}
                </span>
              ))}
              {names.length === 0 && <span className="hint">Define areas in the template above</span>}
            </div>
          </div>
        </aside>

        {/* Preview + Code */}
        <div className="main-panel">
          {/* Live Preview */}
          <div className="preview-wrapper">
            <div className="preview-header">
              <h3>Live Preview</h3>
            </div>
            <div className="preview">
              <div style={previewStyle}>
                {names.map((name, i) => (
                  <div
                    key={name}
                    className="preview-cell"
                    style={{
                      gridArea: name,
                      backgroundColor: `${COLORS[i % COLORS.length]}18`,
                      borderColor: COLORS[i % COLORS.length],
                    }}
                  >
                    <span style={{ color: COLORS[i % COLORS.length] }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Output */}
          <div className="code-wrapper">
            <div className="code-header">
              <div className="code-tabs">
                <button className={`code-tab ${showCode === 'css' ? 'active' : ''}`} onClick={() => setShowCode('css')}>CSS</button>
                <button className={`code-tab ${showCode === 'html' ? 'active' : ''}`} onClick={() => setShowCode('html')}>HTML</button>
              </div>
              <button
                className="copy-btn"
                onClick={() => copy(showCode === 'css' ? css : html, showCode)}
              >
                {copied === showCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-block"><code>{showCode === 'css' ? css : html}</code></pre>
            <button
              className="copy-all-btn"
              onClick={() => copy(`/* CSS */\n${css}\n\n<!-- HTML -->\n${html}`, 'all')}
            >
              {copied === 'all' ? 'Copied!' : 'Copy CSS + HTML'}
            </button>
          </div>
        </div>
      </div>

      <footer>
        <span>GridForge — SU Generator #87</span>
      </footer>
    </div>
  );
}
