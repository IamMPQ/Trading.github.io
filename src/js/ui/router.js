/**
 * AI Trading Platform - SPA Router
 */

const Router = {
    currentView: 'dashboard',
    views: {},
    
    init() {
        // Register all views
        document.querySelectorAll('.view').forEach(view => {
            const viewName = view.id.replace('view-', '');
            this.views[viewName] = view;
        });

        // Setup navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) this.navigate(view);
            });
        });

        // Handle hash-based routing
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && this.views[hash]) {
                this.navigate(hash);
            }
        });

        // Check initial hash
        const hash = window.location.hash.replace('#', '');
        if (hash && this.views[hash]) {
            this.navigate(hash);
        }
    },

    navigate(viewName) {
        if (!this.views[viewName]) {
            console.warn(`View '${viewName}' not found`);
            return;
        }

        // Hide all views
        Object.values(this.views).forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        this.views[viewName].classList.add('active');
        this.currentView = viewName;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        // Update URL hash
        window.location.hash = viewName;

        // Trigger view-specific initialization
        this._onViewChange(viewName);
    },

    _onViewChange(viewName) {
        // Notify components of view change
        const event = new CustomEvent('viewChange', { detail: { view: viewName } });
        document.dispatchEvent(event);
    },

    getCurrentView() {
        return this.currentView;
    }
};

export default Router;
