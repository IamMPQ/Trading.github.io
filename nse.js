/* ============================================
   Light Theme
   ============================================ */
[data-theme="light"] {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f1f5f9;
    --text: #1e293b;
    --text-secondary: #64748b;
    --border: #e2e8f0;
    --border-hover: #cbd5e1;
    --hover: rgba(0, 0, 0, 0.04);
    --active-bg: rgba(99, 102, 241, 0.08);
    --primary: #6366f1;
    --primary-hover: #5558e6;
    --accent: #0891b2;
    --positive: #16a34a;
    --negative: #dc2626;
    --warning: #d97706;
    --neutral: #64748b;
    --positive-bg: rgba(22, 163, 74, 0.08);
    --negative-bg: rgba(220, 38, 38, 0.08);
    --warning-bg: rgba(217, 119, 6, 0.08);
    --badge-bg: rgba(0, 0, 0, 0.08);
    --shadow: 0 0 20px rgba(0, 0, 0, 0.08);
    --chart-bg: #ffffff;
    --chart-grid: #e2e8f0;
    --chart-text: #64748b;
    --modal-overlay: rgba(0, 0, 0, 0.4);

    /* Component-specific overrides */
    --sidebar-bg: #ffffff;
    --topbar-bg: rgba(255, 255, 255, 0.95);
    --card-bg: #ffffff;
    --input-bg: #ffffff;
    --input-text: #1e293b;
    --toggle-bg: #e2e8f0;
    --toggle-active: var(--primary);
    --toggle-knob: #fff;
    --scrollbar-thumb: #cbd5e1;
}

[data-theme="light"] body {
    background: var(--bg-primary);
    color: var(--text);
}

[data-theme="light"] .sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
}

[data-theme="light"] .topbar {
    background: var(--topbar-bg);
    backdrop-filter: blur(12px);
}

[data-theme="light"] .card {
    background: var(--card-bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .form-input,
[data-theme="light"] .form-select,
[data-theme="light"] .topbar-search input,
[data-theme="light"] .chat-input-row input {
    background: var(--input-bg);
    color: var(--input-text);
    border-color: var(--border);
}

[data-theme="light"] .toggle-slider {
    background: var(--toggle-bg);
}

[data-theme="light"] .toggle input:checked + .toggle-slider {
    background: var(--toggle-active);
}

[data-theme="light"] .toggle-slider::before {
    background: var(--toggle-knob);
}

[data-theme="light"] .search-results {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

[data-theme="light"] .modal-overlay {
    background: var(--modal-overlay);
}

[data-theme="light"] .modal {
    background: var(--bg-primary);
    border: 1px solid var(--border);
}

[data-theme="light"] .notification {
    border: 1px solid var(--border);
}

[data-theme="light"] ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
}

[data-theme="light"] #loading-screen {
    background: var(--bg-primary);
}

[data-theme="light"] .loader-title {
    color: var(--text);
}

[data-theme="light"] .topbar-btn:hover {
    background: var(--hover);
}

[data-theme="light"] .index-card {
    background: var(--bg-tertiary);
}

[data-theme="light"] .ai-pick-card {
    background: var(--bg-tertiary);
}

[data-theme="light"] .heatmap-item {
    background: var(--bg-tertiary);
}

[data-theme="light"] .sector-item {
    background: var(--bg-tertiary);
}

[data-theme="light"] .breadth-fill.positive {
    background: var(--positive);
}

[data-theme="light"] .breadth-fill.negative {
    background: var(--negative);
}

[data-theme="light"] .chat-message.bot .message-content {
    background: var(--bg-tertiary);
}

[data-theme="light"] .rec-detail-item {
    border-bottom: 1px solid var(--border);
}

[data-theme="light"] .nav-item:hover {
    background: var(--hover);
}

[data-theme="light"] .nav-item.active {
    background: var(--active-bg);
}

[data-theme="light"] .signal-strong-buy { background: #16a34a15; color: #16a34a; }
[data-theme="light"] .signal-buy { background: #22c55e15; color: #16a34a; }
[data-theme="light"] .signal-neutral { background: #f59e0b15; color: #d97706; }
[data-theme="light"] .signal-sell { background: #ef444415; color: #dc2626; }
[data-theme="light"] .signal-strong-sell { background: #dc262615; color: #dc2626; }
