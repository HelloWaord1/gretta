// Game State Management
let gameState = {
    marketCap: 0, // Initial Market Cap
    gretaSupport: 0,
    zettaSupport: 0,
    gretaPosition: 5, // Position in percentage (5% = start)
    isGretaHappy: false,
    isZettaAngry: false,
    animationSpeed: 500, // Animation duration in ms
    isConnected: false,
    tokenAddress: 'GXG4Zu7mEAKHdGVnhhy6h3bHrN5nqYpSJcyVGooiPump',
    maxMarketCap: 10000000 // $10M = 100% (Israel)
};

// WebSocket connection
let ws = null;
const WS_URL = 'ws://localhost:3001';

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
    connectWebSocket();
    setupEventListeners();
    addBackgroundEffects();
    
    console.log('⚡ Greta vs Zetta initialized!');
    showNotification('🎮 Game Ready!', 'Connecting to live data...');
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
    // Position based ONLY on Market Cap (0 = Start, $10M = Israel)
    const marketCapRatio = gameState.marketCap / gameState.maxMarketCap;
    
    // Map 0-$10M to 5%-80% position (leaving margins for start/end points)
    gameState.gretaPosition = Math.min(Math.max(5 + (marketCapRatio * 75), 5), 80);
    
    // Animate Greta's movement
    if (elements.gretaCharacter) {
        elements.gretaCharacter.style.left = gameState.gretaPosition + '%';
    }
    
    // Determine emotions based on position
    // Happy when closer to Israel (>50% = $5M+)
    gameState.isGretaHappy = gameState.gretaPosition > 42.5; // ~$5M
    
    // Zetta gets angry when Greta is >60% to Israel (~$7M+) 
    gameState.isZettaAngry = gameState.gretaPosition > 65;
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
    
    // Buy token link - no need for event listener since it's now a direct link
    
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
            // Open buy link in new tab
            window.open('https://dexscreener.com/solana/7afebgrxemqdqmqpdhxqr7uis6iswsaugotcrgmfdehz', '_blank');
            break;
        case 'r':
            resetGame();
            break;
    }
}

// Support Greta
function supportGreta() {
    // Visual feedback
    showClickEffect('💚', 'Greta Support!', 'success');
    addPulseEffect(elements.gretaCard);
    
    // Send to server
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'supportGreta'
        }));
    } else {
        // Fallback for offline mode
        gameState.gretaSupport++;
        updateDisplay();
        showNotification('⚠️ Offline Mode', 'Vote counted locally only');
    }
    
    console.log('💚 Greta support sent!');
}

// Support Zetta
function supportZetta() {
    // Visual feedback
    showClickEffect('💙', 'Zetta Support!', 'info');
    addPulseEffect(elements.zettaCard);
    
    // Send to server
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'supportZetta'
        }));
    } else {
        // Fallback for offline mode
        gameState.zettaSupport++;
        updateDisplay();
        showNotification('⚠️ Offline Mode', 'Vote counted locally only');
    }
    
    console.log('💙 Zetta support sent!');
}

// Reset Game
function resetGame() {
    gameState = {
        marketCap: 0,
        gretaSupport: 0,
        zettaSupport: 0,
        gretaPosition: 5,
        isGretaHappy: false,
        isZettaAngry: false,
        animationSpeed: 500,
        isConnected: gameState.isConnected, // Keep connection state
        tokenAddress: 'GXG4Zu7mEAKHdGVnhhy6h3bHrN5nqYpSJcyVGooiPump',
        maxMarketCap: 10000000
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

// WebSocket Connection Management
function connectWebSocket() {
    try {
        ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
            console.log('🔗 Connected to server');
            gameState.isConnected = true;
            updateConnectionStatus(true);
            showNotification('🟢 Connected!', 'Live data and voting active');
        };
        
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                handleServerMessage(message);
            } catch (error) {
                console.error('❌ Error parsing server message:', error);
            }
        };
        
        ws.onclose = () => {
            console.log('📤 Disconnected from server');
            gameState.isConnected = false;
            updateConnectionStatus(false);
            showNotification('🔴 Disconnected', 'Retrying connection...');
            
            // Reconnect after 3 seconds
            setTimeout(connectWebSocket, 3000);
        };
        
        ws.onerror = (error) => {
            console.error('🔴 WebSocket error:', error);
            gameState.isConnected = false;
            updateConnectionStatus(false);
        };
        
    } catch (error) {
        console.error('❌ Failed to connect:', error);
        showNotification('⚠️ Connection Failed', 'Running in offline mode');
        // Fallback to initial display
        updateDisplay();
    }
}

// Handle Server Messages
function handleServerMessage(message) {
    switch (message.type) {
        case 'stateUpdate':
            // Initial state from server
            gameState.gretaSupport = message.data.gretaSupport;
            gameState.zettaSupport = message.data.zettaSupport;
            gameState.marketCap = message.data.marketCap;
            updateDisplay();
            break;
            
        case 'vote':
            // Live vote update
            if (message.data.type === 'greta') {
                gameState.gretaSupport = message.data.count;
            } else if (message.data.type === 'zetta') {
                gameState.zettaSupport = message.data.count;
            }
            updateDisplay();
            break;
            
        case 'marketCapUpdate':
            // Live market cap update
            gameState.marketCap = message.data.marketCap;
            updateDisplay();
            
            // Show price change notification
            if (message.data.changePercent && Math.abs(message.data.changePercent) > 1) {
                const direction = message.data.change > 0 ? '📈' : '📉';
                const sign = message.data.changePercent > 0 ? '+' : '';
                showNotification(
                    `${direction} Market Update`,
                    `${sign}${message.data.changePercent}% • Source: ${message.data.source}`
                );
            }
            break;
            
        case 'notification':
            // Server notifications (trades, alerts, etc.)
            showNotification(message.data.title, message.data.message, message.data.type);
            break;
            
        default:
            console.log('📨 Unknown message type:', message.type);
    }
}

// Update Connection Status UI
function updateConnectionStatus(isConnected) {
    // Add connection indicator to header
    let indicator = document.querySelector('.connection-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'connection-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(indicator);
    }
    
    if (isConnected) {
        indicator.textContent = '🟢 Live';
        indicator.style.background = 'rgba(76, 175, 80, 0.2)';
        indicator.style.border = '1px solid rgba(76, 175, 80, 0.4)';
        indicator.style.color = '#4CAF50';
    } else {
        indicator.textContent = '🔴 Offline';
        indicator.style.background = 'rgba(244, 67, 54, 0.2)';
        indicator.style.border = '1px solid rgba(244, 67, 54, 0.4)';
        indicator.style.color = '#F44336';
    }
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
    
    console.log('⚡ Greta vs Zetta - Real-time Battle! 🚀');
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