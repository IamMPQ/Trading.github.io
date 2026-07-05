/**
 * AI Trading Platform - Notification System
 */

let notificationId = 0;

function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const id = ++notificationId;
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notif-${id}`;
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="close-btn" onclick="dismissNotification(${id})">&times;</button>
    `;

    container.appendChild(notification);

    if (duration > 0) {
        setTimeout(() => dismissNotification(id), duration);
    }
}

function dismissNotification(id) {
    const el = document.getElementById(`notif-${id}`);
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100px)';
        setTimeout(() => el.remove(), 300);
    }
}

// Make globally accessible
window.showNotification = showNotification;
window.dismissNotification = dismissNotification;

export { showNotification, dismissNotification };
