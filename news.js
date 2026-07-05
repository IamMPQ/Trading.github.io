/* ============================================
   Dark Theme
   ============================================ */
[data-theme="dark"] {
    --bg-primary: #0f0f1a;
    --bg-secondary: #1a1a2e;
    --bg-tertiary: #252540;
    --text: #e2e8f0;
    --text-secondary: #94a3b8;
    --border: #2a2a45;
    --border-hover: #3a3a5c;
    --hover: rgba(255, 255, 255, 0.05);
    --active-bg: rgba(99, 102, 241, 0.1);
    --primary: #6366f1;
    --primary-hover: #5558e6;
    --accent: #22d3ee;
    --positive: #22c55e;
    --negative: #ef4444;
    --warning: #f59e0b;
    --neutral: #64748b;
    --positive-bg: rgba(34, 197, 94, 0.1);
    --negative-bg: rgba(239, 68, 68, 0.1);
    --warning-bg: rgba(245, 158, 11, 0.1);
    --badge-bg: rgba(255, 255, 255, 0.1);
    --shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    --chart-bg: #1a1a2e;
    --chart-grid: #2a2a45;
    --chart-text: #94a3b8;
    --modal-overlay: rgba(0, 0, 0, 0.7);

    /* Component-specific overrides */
    --sidebar-bg: #12122a;
    --topbar-bg: rgba(15, 15, 26, 0.95);
    --card-bg: #1a1a2e;
    --input-bg: #1a1a2e;
    --input-text: #e2e8f0;
    --toggle-bg: #2a2a45;
    --toggle-active: var(--primary);
    --toggle-knob: #fff;
    --scrollbar-thumb: #3a3a5c;
}

[data-theme="dark"] body {
    background: var(--bg-primary);
    color: var(--text);
}

[data-theme="dark"] .sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
}

[data-theme="dark"] .topbar {
    background: var(--topbar-bg);
    backdrop-filter: blur(12px);
}

[data-theme="dark"] .card {
    background: var(--card-bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .form-input,
[data-theme="dark"] .form-select,
[data-theme="dark"] .topbar-search input,
[data-theme="dark"] .chat-input-row input {
    background: var(--input-bg);
    color: var(--input-text);
}

[data-theme="dark"] .toggle-slider {
    background: var(--toggle-bg);
}

[data-theme="dark"] .toggle input:checked + .toggle-slider {
    background: var(--toggle-active);
}

[data-theme="dark"] .toggle-slider::before {
    background: var(--toggle-knob);
}

[data-theme="dark"] .search-results {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
}

[data-theme="dark"] .modal-overlay {
    background: var(--modal-overlay);
}

[data-theme="dark"] .modal {
    background: var(--bg-primary);
    border: 1px solid var(--border);
}

[data-theme="dark"] .notification {
    border: 1px solid var(--border);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
}

[data-theme="dark"] #loading-screen {
    background: var(--bg-primary);
}

[data-theme="dark"] .loader-title {
    color: var(--text);
}

[data-theme="dark"] .topbar-btn:hover {
    background: var(--hover);
}

[data-theme="dark"] .heatmap-item {
    background: var(--bg-tertiary);
}

[data-theme="dark"] .sector-item {
    background: var(--bg-secondary);
}

[data-theme="dark"] .breadth-fill.positive {
    background: var(--positive);
}

[data-theme="dark"] .breadth-fill.negative {
    background: var(--negative);
}
