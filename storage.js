/**
 * AI Trading Platform - AI Assistant Component
 */

function initAssistant() {
    const chatInput = document.getElementById('chat-input');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    // Add user message
    addChatMessage(query, 'user');
    
    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        // Get AI response
        const context = {
            sentimentData: SentimentAnalysis.analyzeMarketSentiment(
                NewsAPI._newsCache, 
                APP.state.indices, 
                { advances: 1000, declines: 800, unchanged: 100 }
            ),
            recommendations: aiEngine.getTopRecommendations(5)
        };

        const response = await aiEngine.getAIResponse(query, context);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add bot response
        addChatMessage(response.text, 'bot');
        
        // Add follow-up suggestions if applicable
        if (response.data) {
            addQuickActions(response.data);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addChatMessage('I encountered an error processing your request. Please try again.', 'bot');
        console.error('Assistant error:', error);
    }
}

function sendQuickQuery(query) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = query;
        sendChatMessage();
    }
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    msgDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            ${text.replace(/\n/g, '<br>')}
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.id = id;
    div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content" style="display: flex; gap: 4px; align-items: center;">
            <span style="animation: pulse 1s ease infinite;">●</span>
            <span style="animation: pulse 1s ease infinite 0.2s;">●</span>
            <span style="animation: pulse 1s ease infinite 0.4s;">●</span>
            <span style="margin-left: 4px; opacity: 0.6;">Analyzing...</span>
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    if (id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

function addQuickActions(data) {
    const container = document.getElementById('chat-messages');
    if (!container || !data) return;

    if (data.symbol) {
        const div = document.createElement('div');
        div.className = 'chat-message bot';
        div.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-sm btn-secondary" onclick="navigateToCharts('${data.symbol}')">
                        <i class="fas fa-chart-line"></i> View Chart
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="addToWatchlist('${data.symbol}'); showNotification('${data.symbol} added to watchlist', 'success');">
                        <i class="fas fa-star"></i> Add to Watchlist
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="document.getElementById('chat-input').value = 'Is ${data.symbol} a good buy today?'; sendChatMessage();">
                        <i class="fas fa-question"></i> Ask More
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

function clearChat() {
    const container = document.getElementById('chat-messages');
    if (container) {
        container.innerHTML = `
            <div class="chat-message bot">
                <div class="message-avatar"><i class="fas fa-robot"></i></div>
                <div class="message-content">
                    <p>Chat cleared. How can I help you with today's trading?</p>
                </div>
            </div>
        `;
    }
}

// Make globally accessible
window.sendChatMessage = sendChatMessage;
window.sendQuickQuery = sendQuickQuery;
window.clearChat = clearChat;

export { initAssistant, sendChatMessage, sendQuickQuery };
