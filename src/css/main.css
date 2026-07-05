/* ============================================
   AI Intraday Trading Platform - Main Styles
   ============================================ */

/* CSS Custom Properties */
:root {
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;

    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 50%;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.2);
    --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.3);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 400ms ease;

    /* Font */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    /* Layout */
    --sidebar-width: 240px;
    --sidebar-collapsed-width: 68px;
    --topbar-height: 56px;
    --max-content-width: 1440px;
}

/* Reset & Base */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
}

a {
    text-decoration: none;
    color: inherit;
}

ul, ol {
    list-style: none;
}

img {
    max-width: 100%;
    height: auto;
}

button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    font-size: inherit;
}

input, select, textarea {
    font-family: inherit;
    font-size: inherit;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.125rem; }
h4 { font-size: 1rem; }

.text-mono {
    font-family: var(--font-mono);
}

.text-sm { font-size: 0.75rem; }
.text-md { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 2rem; }

.text-muted { opacity: 0.7; }
.text-bold { font-weight: 700; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Loading Screen */
#loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

#loading-screen.hidden {
    opacity: 0;
    visibility: hidden;
}

.loader-container {
    text-align: center;
}

.loader-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: var(--accent);
    border-right-color: var(--primary);
    animation: spin 1s linear infinite;
    margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loader-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
}

.loader-title {
    font-size: 1.5rem;
    font-weight: 700;
}

.loader-subtitle {
    font-size: 0.875rem;
    opacity: 0.7;
}

.loader-progress {
    width: 300px;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
    margin: 0 auto;
}

.loader-progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    border-radius: 2px;
    transition: width 0.3s ease;
}

/* App Layout */
#app {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: var(--sidebar-width);
    z-index: 100;
    display: flex;
    flex-direction: column;
    transition: width var(--transition-normal), transform var(--transition-normal);
    overflow: hidden;
}

.sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    height: 64px;
    border-bottom: 1px solid var(--border);
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    overflow: hidden;
}

.logo-icon {
    font-size: 1.5rem;
    color: var(--accent);
    min-width: 28px;
}

.logo-text {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    transition: opacity var(--transition-normal);
}

.sidebar.collapsed .logo-text {
    opacity: 0;
    width: 0;
}

.logo-title {
    font-size: 1rem;
    font-weight: 700;
}

.logo-subtitle {
    font-size: 0.7rem;
    opacity: 0.6;
}

.sidebar-toggle {
    font-size: 1.2rem;
    padding: var(--spacing-xs);
    opacity: 0.7;
    transition: opacity var(--transition-fast);
}

.sidebar-toggle:hover {
    opacity: 1;
}

.sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-sm);
}

.nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: 2px;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all var(--transition-fast);
    position: relative;
}

.nav-item i {
    font-size: 1.1rem;
    min-width: 20px;
    text-align: center;
}

.nav-item span {
    transition: opacity var(--transition-normal);
}

.sidebar.collapsed .nav-item span {
    opacity: 0;
    width: 0;
    overflow: hidden;
}

.nav-item:hover {
    background: var(--hover);
}

.nav-item.active {
    background: var(--active-bg);
    color: var(--accent);
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    border-radius: 0 3px 3px 0;
    background: var(--accent);
}

.nav-badge {
    margin-left: auto;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    background: var(--badge-bg);
    font-weight: 600;
    min-width: 20px;
    text-align: center;
}

.nav-badge.accent {
    background: var(--accent);
    color: #fff;
}

.sidebar-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border);
}

.market-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.75rem;
    margin-bottom: var(--spacing-xs);
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-indicator.open {
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e66;
}

.status-indicator.closed {
    background: #ef4444;
    box-shadow: 0 0 8px #ef444466;
}

.status-indicator.checking {
    background: #f59e0b;
    animation: pulse 1s ease infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.sidebar-version {
    font-size: 0.65rem;
    opacity: 0.4;
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: margin-left var(--transition-normal);
}

.sidebar.collapsed ~ .main-content {
    margin-left: var(--sidebar-collapsed-width);
}

/* Top Bar */
.topbar {
    height: var(--topbar-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-lg);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 50;
}

.topbar-left {
    flex: 1;
    overflow: hidden;
}

.market-ticker {
    display: flex;
    gap: var(--spacing-lg);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.market-ticker::-webkit-scrollbar {
    display: none;
}

.ticker-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.8rem;
    white-space: nowrap;
}

.ticker-name {
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.7;
}

.ticker-price {
    font-family: var(--font-mono);
    font-weight: 600;
}

.ticker-change {
    font-family: var(--font-mono);
    font-size: 0.75rem;
}

.ticker-change.positive { color: var(--positive); }
.ticker-change.negative { color: var(--negative); }

.topbar-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex-shrink: 0;
}

.topbar-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: background var(--transition-fast);
    position: relative;
}

.topbar-btn:hover {
    background: var(--hover);
}

.notif-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    display: none;
}

.notif-dot.show {
    display: block;
}

.topbar-search {
    position: relative;
    width: 240px;
}

.topbar-search input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    font-size: 0.8rem;
    outline: none;
    transition: border var(--transition-fast);
}

.topbar-search input:focus {
    border-color: var(--accent);
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    opacity: 0.5;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 200;
    display: none;
}

.search-results.show {
    display: block;
}

.search-result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background var(--transition-fast);
}

.search-result-item:hover {
    background: var(--hover);
}

.topbar-time {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0 var(--spacing-sm);
}

/* Page Content */
.page-container {
    flex: 1;
    padding: var(--spacing-lg);
    max-width: var(--max-content-width);
    margin: 0 auto;
    width: 100%;
}

/* Views */
.view {
    display: none;
    animation: fadeIn 0.3s ease;
}

.view.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.view-header h2 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.view-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

/* Cards */
.card {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: box-shadow var(--transition-normal), border-color var(--transition-normal);
}

.card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-md);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border);
}

.card-header h3 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.9rem;
    font-weight: 600;
}

.card-header h3 i {
    opacity: 0.7;
}

.card-body {
    padding: var(--spacing-md);
}

.card-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.card-span-2 {
    grid-column: span 2;
}

/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
}

/* Data Tables */
.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
}

.data-table thead {
    border-bottom: 1px solid var(--border);
}

.data-table th {
    text-align: left;
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.7;
}

.data-table td {
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: 1px solid var(--border);
}

.data-table tbody tr:hover {
    background: var(--hover);
}

.data-table .positive { color: var(--positive); }
.data-table .negative { color: var(--negative); }

.data-table.compact th,
.data-table.compact td {
    padding: 6px var(--spacing-sm);
}

.empty-row {
    text-align: center;
    opacity: 0.5;
    padding: var(--spacing-xl) !important;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-weight: 500;
    font-size: 0.8rem;
    transition: all var(--transition-fast);
    white-space: nowrap;
}

.btn-primary {
    background: var(--primary);
    color: #fff;
}

.btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text);
    border: 1px solid var(--border);
}

.btn-secondary:hover {
    background: var(--hover);
    border-color: var(--border-hover);
}

.btn-accent {
    background: var(--accent);
    color: #fff;
}

.btn-accent:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
}

.btn-danger {
    background: var(--negative);
    color: #fff;
}

.btn-danger:hover {
    filter: brightness(1.1);
}

.btn-sm {
    padding: 4px 10px;
    font-size: 0.75rem;
}

.btn-lg {
    padding: 12px 24px;
    font-size: 0.95rem;
}

.btn-block {
    width: 100%;
    justify-content: center;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    transition: all var(--transition-fast);
}

.btn-icon:hover {
    background: var(--hover);
}

/* Form Elements */
.form-input {
    width: 100%;
    padding: 10px 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    font-size: 0.85rem;
    outline: none;
    transition: border var(--transition-fast);
}

.form-input:focus {
    border-color: var(--accent);
}

.form-select {
    padding: 8px 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    transition: border var(--transition-fast);
}

.form-select:focus {
    border-color: var(--accent);
}

.form-group {
    margin-bottom: var(--spacing-md);
}

.form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    opacity: 0.8;
}

/* Toggle Switch */
.toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    cursor: pointer;
}

.toggle input {
    display: none;
}

.toggle-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    transition: var(--transition-fast);
}

.toggle-slider::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: var(--transition-fast);
}

.toggle input:checked + .toggle-slider::before {
    transform: translateX(20px);
}

/* Badges */
.badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
}

.badge-accent {
    background: var(--accent);
    color: #fff;
}

.badge-success {
    background: var(--positive);
    color: #fff;
}

.badge-danger {
    background: var(--negative);
    color: #fff;
}

.badge-warning {
    background: var(--warning);
    color: #000;
}

.badge-neutral {
    background: var(--neutral);
    color: #fff;
}

/* Tab Group */
.tab-group {
    display: flex;
    gap: 2px;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 2px;
}

.tab-btn {
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    transition: all var(--transition-fast);
}

.tab-btn.active {
    background: var(--bg-primary);
    color: var(--accent);
    box-shadow: var(--shadow-sm);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

/* Update Time */
.update-time {
    font-size: 0.7rem;
    opacity: 0.5;
    font-family: var(--font-mono);
}

/* Indices Grid */
.indices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.index-card {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    transition: transform var(--transition-fast);
}

.index-card:hover {
    transform: translateY(-2px);
}

.index-name {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0.7;
}

.index-price {
    font-size: 1.3rem;
    font-weight: 700;
    font-family: var(--font-mono);
    margin: var(--spacing-xs) 0;
}

.index-change {
    font-size: 0.85rem;
    font-family: var(--font-mono);
    font-weight: 500;
}

.index-change.positive { color: var(--positive); }
.index-change.negative { color: var(--negative); }

/* Heatmap */
.heatmap-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 3px;
}

.heatmap-item {
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform var(--transition-fast);
    position: relative;
}

.heatmap-item:hover {
    transform: scale(1.15);
    z-index: 5;
}

/* AI Picks */
.ai-picks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--spacing-md);
}

.ai-pick-card {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
}

.ai-pick-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
}

.ai-pick-symbol {
    font-weight: 700;
    font-size: 1rem;
}

.ai-pick-signal {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
}

.signal-strong-buy { background: #16a34a22; color: #16a34a; }
.signal-buy { background: #22c55e22; color: #22c55e; }
.signal-neutral { background: #f59e0b22; color: #f59e0b; }
.signal-sell { background: #ef444422; color: #ef4444; }
.signal-strong-sell { background: #dc262622; color: #dc2626; }

.ai-pick-price {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
}

.ai-pick-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    opacity: 0.7;
}

/* Breadth Display */
.breadth-display {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.breadth-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
}

.breadth-bar {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    margin: 0 var(--spacing-sm);
    position: relative;
    overflow: hidden;
}

.breadth-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

/* Scanner */
.scanner-stats {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    flex-wrap: wrap;
}

.stat-chip {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.78rem;
    font-weight: 500;
}

.table-wrapper {
    overflow-x: auto;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
}

/* Recommendations Grid */
.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-md);
}

.rec-card {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: all var(--transition-normal);
}

.rec-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-hover);
}

.rec-header {
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
}

.rec-symbol {
    font-size: 1.1rem;
    font-weight: 700;
}

.rec-name {
    font-size: 0.75rem;
    opacity: 0.6;
}

.rec-signal {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
}

.rec-body {
    padding: var(--spacing-md);
}

.rec-price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
    font-size: 0.85rem;
}

.rec-price-label {
    opacity: 0.6;
}

.rec-price-value {
    font-family: var(--font-mono);
    font-weight: 600;
}

.rec-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xs);
    margin: var(--spacing-sm) 0;
    font-size: 0.78rem;
}

.rec-detail-item {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
}

.rec-detail-label {
    opacity: 0.6;
}

.rec-confidence {
    margin-top: var(--spacing-sm);
}

.confidence-bar {
    height: 6px;
    border-radius: 3px;
    background: var(--border);
    overflow: hidden;
    margin-top: 2px;
}

.confidence-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
}

.rec-footer {
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border);
    font-size: 0.7rem;
    opacity: 0.6;
}

/* Watchlist */
.watchlist-tabs {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
    overflow-x: auto;
}

.watchlist-tab {
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--border);
    transition: all var(--transition-fast);
    white-space: nowrap;
}

.watchlist-tab.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
}

.watchlist-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
}

.watchlist-table th,
.watchlist-table td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

/* Charts */
.chart-container {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
}

.trading-chart {
    width: 100%;
    height: 500px;
}

.indicator-panel {
    height: 150px;
    border-top: 1px solid var(--border);
}

.chart-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

/* Assistant */
.assistant-container {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    overflow: hidden;
}

.assistant-chat {
    display: flex;
    flex-direction: column;
    height: 600px;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
}

.chat-message {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.chat-message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.chat-message.bot .message-avatar {
    background: var(--primary);
    color: #fff;
}

.chat-message.user .message-avatar {
    background: var(--accent);
    color: #fff;
}

.message-content {
    max-width: 75%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-lg);
    font-size: 0.85rem;
    line-height: 1.6;
}

.chat-message.bot .message-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
}

.chat-message.user .message-content {
    background: var(--accent);
    color: #fff;
}

.message-content ul {
    list-style: disc;
    padding-left: var(--spacing-lg);
    margin: var(--spacing-xs) 0;
}

.chat-input-container {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border);
}

.chat-suggestions {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
    flex-wrap: wrap;
}

.suggestion-chip {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.75rem;
    border: 1px solid var(--border);
    transition: all var(--transition-fast);
}

.suggestion-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.chat-input-row {
    display: flex;
    gap: var(--spacing-sm);
}

.chat-input-row input {
    flex: 1;
    padding: 10px 16px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    font-size: 0.85rem;
    outline: none;
}

.chat-input-row input:focus {
    border-color: var(--accent);
}

/* Risk Manager */
.risk-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.risk-result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.risk-item {
    text-align: center;
    padding: var(--spacing-sm);
}

.risk-label {
    display: block;
    font-size: 0.75rem;
    opacity: 0.6;
    margin-bottom: var(--spacing-xs);
}

.risk-value {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: var(--font-mono);
}

.risk-value.positive { color: var(--positive); }
.risk-value.danger { color: var(--negative); }

.risk-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
}

.rule {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    font-size: 0.85rem;
}

.rule.good {
    background: var(--positive-bg);
}

.rule.warning {
    background: var(--warning-bg);
}

.rule.danger {
    background: var(--negative-bg);
}

/* Portfolio */
.portfolio-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-md);
}

.portfolio-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
}

.summary-item {
    text-align: center;
    padding: var(--spacing-sm);
}

.summary-label {
    display: block;
    font-size: 0.7rem;
    opacity: 0.6;
    margin-bottom: 2px;
}

.summary-value {
    font-size: 1rem;
    font-weight: 700;
    font-family: var(--font-mono);
}

/* Settings */
.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.85rem;
}

.setting-item .form-select,
.setting-item .form-input {
    width: auto;
    min-width: 150px;
}

/* Footer */
.app-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--border);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    opacity: 0.6;
}

.footer-links {
    display: flex;
    gap: var(--spacing-md);
}

.footer-links a:hover {
    opacity: 1;
    text-decoration: underline;
}

/* Notifications */
.notification-container {
    position: fixed;
    top: 80px;
    right: var(--spacing-lg);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    max-width: 360px;
}

.notification {
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    animation: slideInRight 0.3s ease;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    font-size: 0.85rem;
}

@keyframes slideInRight {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
}

.notification.info { background: var(--primary); color: #fff; }
.notification.success { background: var(--positive); color: #fff; }
.notification.warning { background: var(--warning); color: #000; }
.notification.error { background: var(--negative); color: #fff; }

.notification .close-btn {
    margin-left: auto;
    font-size: 1rem;
    opacity: 0.7;
    flex-shrink: 0;
}

.notification .close-btn:hover {
    opacity: 1;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    display: none;
    align-items: center;
    justify-content: center;
}

.modal-overlay.show {
    display: flex;
}

.modal {
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    animation: modalIn 0.3s ease;
}

@keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border);
}

.modal-close {
    font-size: 1.5rem;
    opacity: 0.5;
    transition: opacity var(--transition-fast);
    line-height: 1;
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    padding: var(--spacing-md);
    overflow-y: auto;
    max-height: calc(80vh - 120px);
}

.modal-footer {
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
}

.empty-state i {
    font-size: 3rem;
    opacity: 0.3;
    margin-bottom: var(--spacing-md);
}

.empty-state h3 {
    margin-bottom: var(--spacing-sm);
}

.empty-state p {
    opacity: 0.6;
    margin-bottom: var(--spacing-lg);
    font-size: 0.9rem;
}

/* Sector Container */
.sector-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-sm);
}

.sector-item {
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    text-align: center;
    font-size: 0.78rem;
}

.sector-name {
    font-weight: 600;
    display: block;
    margin-bottom: 2px;
}

.sector-change {
    font-family: var(--font-mono);
    font-weight: 500;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--accent);
}

/* Utility Classes */
.hidden { display: none !important; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.p-md { padding: var(--spacing-md); }

/* Print */
@media print {
    .sidebar, .topbar, .app-footer, .chat-input-container {
        display: none !important;
    }
    .main-content {
        margin-left: 0 !important;
    }
}
