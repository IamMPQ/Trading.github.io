/* ============================================
   Responsive Design
   ============================================ */

/* Large Desktop (1200px+) */
@media (max-width: 1400px) {
    .dashboard-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    .card-span-2 {
        grid-column: span 2;
    }
}

/* Desktop (992px - 1200px) */
@media (max-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .card-span-2 {
        grid-column: span 2;
    }
    
    .risk-grid,
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .portfolio-grid {
        grid-template-columns: 1fr;
    }
}

/* Tablet (768px - 992px) */
@media (max-width: 992px) {
    :root {
        --sidebar-width: 200px;
    }

    .dashboard-grid {
        grid-template-columns: 1fr 1fr;
    }
    .card-span-2 {
        grid-column: span 2;
    }
    
    .chart-info-grid {
        grid-template-columns: 1fr;
    }
    
    .recommendations-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
    
    .topbar-search {
        width: 180px;
    }
    
    .ticker-item {
        font-size: 0.75rem;
    }
}

/* Mobile Large (576px - 768px) */
@media (max-width: 768px) {
    :root {
        --sidebar-width: 0px;
        --sidebar-collapsed-width: 0px;
    }

    .sidebar {
        transform: translateX(-100%);
        width: 260px !important;
        z-index: 200;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    }
    
    .sidebar.mobile-open {
        transform: translateX(0);
    }
    
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 199;
        display: none;
    }
    
    .sidebar-overlay.show {
        display: block;
    }

    .sidebar .logo-text,
    .sidebar .nav-item span,
    .sidebar .nav-badge {
        opacity: 1 !important;
        width: auto !important;
    }

    .main-content {
        margin-left: 0 !important;
    }

    .topbar {
        padding: 0 var(--spacing-md);
    }
    
    .market-ticker {
        gap: var(--spacing-sm);
    }
    
    .ticker-item {
        font-size: 0.7rem;
    }
    
    .ticker-price {
        font-size: 0.75rem;
    }
    
    .topbar-search {
        display: none;
    }
    
    .topbar-time {
        display: none;
    }
    
    .page-container {
        padding: var(--spacing-md);
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    .card-span-2 {
        grid-column: span 1;
    }
    
    .view-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .view-actions {
        width: 100%;
        overflow-x: auto;
    }
    
    .indices-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .ai-picks-grid {
        grid-template-columns: 1fr;
    }
    
    .scanner-stats {
        overflow-x: auto;
    }
    
    .risk-result-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .risk-rules {
        grid-template-columns: 1fr;
    }
    
    .portfolio-summary {
        grid-template-columns: 1fr 1fr;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .chat-message .message-content {
        max-width: 85%;
    }
    
    .chat-suggestions {
        display: none;
    }
    
    .rec-detail-grid {
        grid-template-columns: 1fr;
    }
    
    .empty-state {
        padding: var(--spacing-xl) var(--spacing-md);
    }
}

/* Mobile Small (< 576px) */
@media (max-width: 576px) {
    .indices-grid {
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-sm);
    }
    
    .index-price {
        font-size: 1rem;
    }
    
    .data-table {
        font-size: 0.7rem;
    }
    
    .data-table th,
    .data-table td {
        padding: 4px 8px;
    }
    
    .btn {
        padding: 6px 12px;
        font-size: 0.75rem;
    }
    
    .form-select {
        padding: 6px 10px;
        font-size: 0.75rem;
    }
    
    .recommendations-grid {
        grid-template-columns: 1fr;
    }
    
    .trading-chart {
        height: 350px;
    }
    
    .assistant-chat {
        height: 500px;
    }
    
    .modal {
        width: 95%;
        max-height: 90vh;
    }
    
    .footer-content {
        flex-direction: column;
        gap: var(--spacing-xs);
        text-align: center;
    }
    
    .navbar-toggle {
        display: flex !important;
    }
    
    .topbar-left {
        overflow-x: auto;
    }

    .sector-container {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .heatmap-container {
        grid-template-columns: repeat(5, 1fr);
    }
}

/* Mobile menu toggle button */
.mobile-menu-btn {
    display: none;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

@media (max-width: 768px) {
    .mobile-menu-btn {
        display: flex !important;
    }
}

/* Landscape mode on mobile */
@media (max-height: 500px) and (orientation: landscape) {
    .sidebar {
        overflow-y: auto;
    }
    
    .assistant-chat {
        height: 350px;
    }
    
    .trading-chart {
        height: 250px;
    }
}

/* High DPI / Retina */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    body {
        -webkit-font-smoothing: antialiased;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
    [data-theme="light"] {
        /* Keep user preference */
    }
}
