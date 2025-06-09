// Game State Management
let gameState = {
    marketCap: 1000000, // Initial Market Cap
    gretaSupport: 0,
    zettaSupport: 0,
    gretaPosition: 20, // Position in percentage (20% = start)
    isGretaHappy: true,
    isZettaAngry: false,
    animationSpeed: 500 // Animation duration in ms
};

// DOM Elements
const elements = {
    marketCapValue: document.getElementById('marketCapValue'),
    gretaSupport: document.getElementById('gretaSupport'),
    zettaSupport: document.getElementById('israelSupport'), // Keep same ID but different meaning
    gretaCharacter: document.getElementById('gretaCharacter'),
    gretaEmotion: document.getElementById('gretaEmotion'),
    zettaCharacter: document.getElementById('zettaCharacter'),
    zettaEmotion: document.getElementById('zettaEmotion'),
    zettaZone: document.getElementById('zettaZone'),
    buyTokenBtn: document.getElementById('buyTokenBtn'),
    gretaCard: document.querySelector('.greta-card'),
    zettaCard: document.querySelector('.israel-card') // Keep same class name
};

// Game Initialization
function initGame() {
    validateElements();
    updateDisplay();
    setupEventListeners();
    startMarketCapSimulation();
    addBackgroundEffects();
    
    console.log('⚡ Greta vs Zetta initialized!');
    showNotification('🎮 Game Ready!', 'Click characters to support them!');
}

// Validate DOM Elements
function validateElements() {
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.warn(`⚠️ Element not found: ${key}`);
        }
    }
}

// Update Display
function updateDisplay() {
    updateMarketCap();
    updateSupportCounters();
    updateGretaPosition();
    updateCharacterAnimations();
}

// Update Market Cap Display
function updateMarketCap() {
    if (elements.marketCapValue) {
        elements.marketCapValue.textContent = formatMarketCap(gameState.marketCap);
        animateValueChange(elements.marketCapValue);
    }
}

// Update Support Counters
function updateSupportCounters() {
    if (elements.gretaSupport) {
        elements.gretaSupport.textContent = gameState.gretaSupport;
    }
    if (elements.zettaSupport) {
        elements.zettaSupport.textContent = gameState.zettaSupport;
    }
}

// Format Market Cap Value
function formatMarketCap(value) {
    if (value >= 1000000000) {
        return '$' + (value / 1000000000).toFixed(2) + 'B';
    } else if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(2) + 'K';
    } else {
        return '$' + value.toFixed(2);
    }
}

// Update Greta's Position
function updateGretaPosition() {
    // Position based on Market Cap and support difference
    const basePosition = Math.min(Math.max(gameState.marketCap / 10000000 * 60, 5), 80);
    const supportBonus = (gameState.gretaSupport - gameState.zettaSupport) * 0.5;
    
    gameState.gretaPosition = Math.min(Math.max(basePosition + supportBonus, 5), 80);
    
    // Animate Greta's movement
    if (elements.gretaCharacter) {
        elements.gretaCharacter.style.left = gameState.gretaPosition + '%';
    }
    
    // Determine emotions
    gameState.isGretaHappy = gameState.gretaPosition > 40;
    gameState.isZettaAngry = gameState.gretaPosition > 50;
}

// Update Character Animations
function updateCharacterAnimations() {
    updateGretaAnimations();
    updateZettaAnimations();
}

// Update Greta's Animations
function updateGretaAnimations() {
    if (!elements.gretaCharacter || !elements.gretaEmotion) return;
    
    if (gameState.isGretaHappy) {
        elements.gretaCharacter.className = 'character greta-character happy';
        elements.gretaEmotion.textContent = '😊';
    } else {
        elements.gretaCharacter.className = 'character greta-character sad';
        elements.gretaEmotion.textContent = '😢';
    }
}

// Update Zetta's Animations
function updateZettaAnimations() {
    if (!elements.zettaCharacter || !elements.zettaEmotion) return;
    
    if (gameState.isZettaAngry) {
        elements.zettaCharacter.className = 'character zetta-character angry';
        elements.zettaEmotion.textContent = '😡';
    } else {
        elements.zettaCharacter.className = 'character zetta-character calm';
        elements.zettaEmotion.textContent = '😌';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Greta support (character + card)
    [elements.gretaCharacter, elements.gretaCard].forEach(element => {
        if (element) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                supportGreta();
            });
        }
    });
    
    // Zetta support (character + card + zone)
    [elements.zettaCharacter, elements.zettaCard, elements.zettaZone].forEach(element => {
        if (element) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                supportZetta();
            });
        }
    });
    
    // Buy token button
    if (elements.buyTokenBtn) {
        elements.buyTokenBtn.addEventListener('click', () => {
            buyToken();
        });
    }
    
    // Track area support for Greta
    const journeySection = document.querySelector('.journey-section');
    if (journeySection) {
        journeySection.addEventListener('click', (e) => {
            if (e.target === e.currentTarget || 
                e.target.classList.contains('journey-track') || 
                e.target.classList.contains('track-line')) {
                supportGreta();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Handle Keyboard Shortcuts
function handleKeyboard(e) {
    switch(e.key.toLowerCase()) {
        case 'g':
            supportGreta();
            break;
        case 'z':
            supportZetta();
            break;
        case 'b':
            buyToken();
            break;
        case 'r':
            resetGame();
            break;
    }
}

// Support Greta
function supportGreta() {
    gameState.gretaSupport++;
    
    // Visual feedback
    showClickEffect('💚', 'Greta Support!', 'success');
    addPulseEffect(elements.gretaCard);
    
    // Market impact
    const impact = Math.random() * 15000 + 8000;
    gameState.marketCap += impact;
    
    updateDisplay();
    
    console.log('💚 Greta supported! Market Cap +', formatMarketCap(impact));
}

// Support Zetta
function supportZetta() {
    gameState.zettaSupport++;
    
    // Visual feedback
    showClickEffect('💙', 'Zetta Support!', 'info');
    addPulseEffect(elements.zettaCard);
    
    // Market impact
    const impact = Math.random() * 12000 + 5000;
    gameState.marketCap -= impact;
    gameState.marketCap = Math.max(gameState.marketCap, 10000); // Minimum cap
    
    updateDisplay();
    
    console.log('💙 Zetta supported! Market Cap -', formatMarketCap(impact));
}

// Buy Token
function buyToken() {
    const purchaseAmount = Math.random() * 150000 + 75000;
    gameState.marketCap += purchaseAmount;
    
    // Visual effects
    showClickEffect('💰', `Bought $${formatMarketCap(purchaseAmount)}!`, 'warning');
    addShineEffect(elements.buyTokenBtn);
    
    updateDisplay();
    
    console.log('💰 Token purchased! Market Cap +', formatMarketCap(purchaseAmount));
}

// Reset Game
function resetGame() {
    gameState = {
        marketCap: 1000000,
        gretaSupport: 0,
        zettaSupport: 0,
        gretaPosition: 20,
        isGretaHappy: true,
        isZettaAngry: false,
        animationSpeed: 500
    };
    
    updateDisplay();
    showNotification('🔄 Game Reset!', 'Starting fresh battle!');
}

// Show Click Effect
function showClickEffect(emoji, text, type = 'default') {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    
    const colors = {
        success: '#4CAF50',
        info: '#2196F3', 
        warning: '#FF9800',
        default: '#ffffff'
    };
    
    effect.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${emoji}</div>
        <div style="font-size: 1rem; color: ${colors[type]};">${text}</div>
    `;
    
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 700;
        text-align: center;
        pointer-events: none;
        z-index: 1000;
        text-shadow: 0 2px 8px rgba(0,0,0,0.7);
    `;
    
    document.body.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1500);
}

// Show Notification
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.5rem;">${title}</div>
        <div style="font-size: 0.875rem; opacity: 0.8;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Add CSS animations if not exist
function addAnimationStyles() {
    if (document.querySelector('#gameAnimations')) return;
    
    const style = document.createElement('style');
    style.id = 'gameAnimations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes shine {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(2deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
        
        .pulse-effect { animation: pulse 0.6s ease-out; }
        .shine-effect { animation: shine 0.6s ease-out; }
    `;
    
    document.head.appendChild(style);
}

// Add Pulse Effect
function addPulseEffect(element) {
    if (!element) return;
    
    element.classList.add('pulse-effect');
    setTimeout(() => {
        element.classList.remove('pulse-effect');
    }, 600);
}

// Add Shine Effect
function addShineEffect(element) {
    if (!element) return;
    
    element.classList.add('shine-effect');
    setTimeout(() => {
        element.classList.remove('shine-effect');
    }, 600);
}

// Animate Value Change
function animateValueChange(element) {
    if (!element) return;
    
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.3s ease-out';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

// Market Cap Simulation
function startMarketCapSimulation() {
    setInterval(() => {
        // Random market fluctuations
        const volatility = 0.05; // 5% volatility
        const change = (Math.random() - 0.5) * gameState.marketCap * volatility;
        
        gameState.marketCap += change;
        gameState.marketCap = Math.max(gameState.marketCap, 10000);
        
        updateDisplay();
    }, 4000); // Every 4 seconds
}

// Add Background Effects
function addBackgroundEffects() {
    const emojis = ['⚡', '🚀', '💎', '🌟', '💰', '🔥'];
    
    setInterval(() => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const floating = document.createElement('div');
        floating.className = 'floating-element';
        floating.textContent = emoji;
        
        floating.style.left = Math.random() * 100 + 'vw';
        floating.style.animationDuration = (8 + Math.random() * 4) + 's';
        
        document.body.appendChild(floating);
        
        setTimeout(() => {
            if (floating.parentNode) {
                floating.parentNode.removeChild(floating);
            }
        }, 12000);
    }, 3000);
}

// API Integration (placeholder)
async function fetchRealMarketCap() {
    try {
        // Replace with actual token API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true');
        const data = await response.json();
        
        if (data.ethereum && data.ethereum.usd_market_cap) {
            return data.ethereum.usd_market_cap / 1000; // Scale down for demo
        }
    } catch (error) {
        console.error('🔴 API Error:', error);
    }
    
    return gameState.marketCap;
}

// Update from Real API
async function updateFromAPI() {
    const realMarketCap = await fetchRealMarketCap();
    if (realMarketCap && realMarketCap !== gameState.marketCap) {
        gameState.marketCap = realMarketCap;
        updateDisplay();
        showNotification('📊 Live Data', 'Market Cap updated from API');
    }
}

// Game Loop
function gameLoop() {
    updateDisplay();
    
    // Optional: Add game mechanics here
    // - Time-based events
    // - Automatic market changes
    // - Achievement system
    
    requestAnimationFrame(gameLoop);
}

// Initialize Game on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initGame();
    
    // Optional: Enable real API updates
    // setInterval(updateFromAPI, 60000); // Every minute
    
    console.log('⚡ Greta vs Zetta - Battle for the Market! 🚀');
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('🔴 Game Error:', e.error);
    showNotification('⚠️ Error', 'Something went wrong. Please refresh.');
});

// Performance Monitoring
let lastFrameTime = performance.now();
function monitorPerformance() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime > 100) { // If frame took longer than 100ms
        console.warn('⚠️ Performance warning: Frame took', deltaTime.toFixed(2), 'ms');
    }
    
    lastFrameTime = currentTime;
}

console.log('⚡ Greta vs Zetta script loaded successfully!'); 