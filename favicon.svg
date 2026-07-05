/**
 * AI Trading Platform - Risk Manager Component
 */

function calculatePositionSize() {
    const capital = parseFloat(document.getElementById('risk-capital')?.value) || 100000;
    const entry = parseFloat(document.getElementById('risk-entry')?.value) || 0;
    const stopLoss = parseFloat(document.getElementById('risk-sl')?.value) || 0;
    const target = parseFloat(document.getElementById('risk-target')?.value) || 0;
    const riskPercent = parseFloat(document.getElementById('risk-percent')?.value) || 2;

    if (!entry || !stopLoss) {
        showNotification('Please enter entry price and stop loss', 'warning');
        return;
    }

    if (entry <= stopLoss) {
        showNotification('Entry price must be above stop loss', 'error');
        return;
    }

    // Calculate position details
    const riskPerShare = entry - stopLoss;
    const maxRiskAmount = capital * (riskPercent / 100);
    const positionSize = Math.floor(maxRiskAmount / riskPerShare);
    const totalInvestment = positionSize * entry;
    
    let profitPerShare = 0;
    let riskReward = 0;
    if (target > entry) {
        profitPerShare = target - entry;
        riskReward = (profitPerShare / riskPerShare);
    }

    // Update UI
    const updateValue = (id, value, cls = '') => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            if (cls) el.className = `risk-value ${cls}`;
            else el.className = 'risk-value';
        }
    };

    updateValue('risk-position-size', positionSize.toLocaleString('en-IN'));
    updateValue('risk-amount', formatINR(maxRiskAmount), 'danger');
    updateValue('risk-rr', riskReward > 0 ? `1:${riskReward.toFixed(2)}` : 'N/A');
    updateValue('risk-profit', target > entry ? formatINR(profitPerShare * positionSize) : 'N/A', 'positive');
    updateValue('risk-capital-risk', formatINR(maxRiskAmount), 'danger');
    
    const exposurePercent = (totalInvestment / capital) * 100;
    updateValue('risk-exposure', `${exposurePercent.toFixed(1)}%`);

    // Update risk rules
    const rules = document.getElementById('risk-rules');
    if (rules) {
        const rulesList = [
            { text: `Daily Loss Limit: 5% (${formatINR(capital * 0.05)})`, good: true },
            { text: `Max Risk Per Trade: ${riskPercent}% (${formatINR(maxRiskAmount)})`, good: riskPercent <= 2 },
            { text: `Min Risk/Reward: 1.5`, good: riskReward >= 1.5 },
            { text: `Position Size: ${positionSize} shares`, good: true },
            { text: `Portfolio Exposure: ${exposurePercent.toFixed(1)}%`, good: exposurePercent <= 80 }
        ];

        rules.innerHTML = rulesList.map(rule => `
            <div class="rule ${rule.good ? 'good' : 'warning'}">
                <i class="fas ${rule.good ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${rule.text}</span>
            </div>
        `).join('');
    }

    showNotification(`Position size: ${positionSize} shares. Risk: ${formatINR(maxRiskAmount)}`, 'success');
}

function resetRiskCalculator() {
    document.getElementById('risk-entry').value = '';
    document.getElementById('risk-sl').value = '';
    document.getElementById('risk-target').value = '';
    
    const updateValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    updateValue('risk-position-size', '--');
    updateValue('risk-amount', '--');
    updateValue('risk-rr', '--');
    updateValue('risk-profit', '--');
    updateValue('risk-capital-risk', '--');
    updateValue('risk-exposure', '--');
    
    showNotification('Calculator reset', 'info');
}

// Make globally accessible
window.calculatePositionSize = calculatePositionSize;
window.resetRiskCalculator = resetRiskCalculator;

export { calculatePositionSize, resetRiskCalculator };
