// Global Variables
let marketCap = 1234567;
let gretaSupport = 0;
let israelSupport = 0;
let currentPosition = 10; // Greta's position in percentage (10% - starting position)

// DOM Elements
const marketCapElement = document.getElementById('marketCap');
const gretaSupportElement = document.getElementById('gretaSupport');
const israelSupportElement = document.getElementById('israelSupport');
const boatElement = document.getElementById('boat');
const gretaElement = document.getElementById('greta');
const israelElement = document.getElementById('israelCharacter');
const clickIndicator = document.getElementById('clickIndicator');

// Fun Sound Effects (text-based)
const soundEffects = {
    greta: ['💥 BOOM!', '🌱 ECO POWER!', '🔥 HOW DARE YOU!', '⚡ CLIMATE STRIKE!'],
    israel: ['🏛️ DEMOCRACY!', '💪 STRONG!', '🛡️ DEFEND!', '⭐ BIBI POWER!'],
    achievement: ['🎉 AWESOME!', '🏆 LEGENDARY!', '⚡ EPIC WIN!', '🌟 AMAZING!']
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startMarketCapSimulation();
    createFloatingEmojis();
    showWelcomeMessage();
});

function showWelcomeMessage() {
    setTimeout(() => {
        showAchievement('Welcome to the Epic Battle!', '🎮');
    }, 1000);
}

function initializeApp() {
    updateMarketCapDisplay();
    updateCharacterPositions();
    updateCharacterEmotions();
    addCharacterSpeechBubbles();
}

function setupEventListeners() {
    // Click on Greta for support
    gretaElement.addEventListener('click', function(e) {
        e.stopPropagation();
        supportGreta();
        const effect = soundEffects.greta[Math.floor(Math.random() * soundEffects.greta.length)];
        showClickEffect(e, effect, '#00b894');
        makeCharacterSpeak(gretaElement, 'YES! SAVE THE PLANET!');
    });

    // Click on Israeli character for support
    israelElement.addEventListener('click', function(e) {
        e.stopPropagation();
        supportIsrael();
        const effect = soundEffects.israel[Math.floor(Math.random() * soundEffects.israel.length)];
        showClickEffect(e, effect, '#e17055');
        makeCharacterSpeak(israelElement, 'NOT ON MY WATCH!');
    });

    // Click on Greta's zone (left half of screen)
    document.addEventListener('click', function(e) {
        const screenWidth = window.innerWidth;
        if (e.clientX < screenWidth / 2) {
            supportGreta();
            showClickEffect(e, 'Team Greta +1! 🌱', '#00b894');
        } else {
            supportIsrael();
            showClickEffect(e, 'Team Israel +1! 🏛️', '#e17055');
        }
    });
}

function makeCharacterSpeak(character, text) {
    character.classList.add('active');
    const bubble = character.querySelector('.speech-bubble');
    if (bubble) {
        bubble.textContent = text;
    }
    
    setTimeout(() => {
        character.classList.remove('active');
    }, 2000);
}

function supportGreta() {
    gretaSupport++;
    const increase = Math.floor(Math.random() * 50000) + 10000;
    marketCap += increase;
    
    // Special effects for milestones
    if (gretaSupport % 5 === 0) {
        createEcoConfetti(window.innerWidth / 4, window.innerHeight / 2);
    }
    
    if (gretaSupport % 10 === 0) {
        createSpecialEffect('eco');
    }
    
    updateDisplays();
    updateCharacterPositions();
    updateCharacterEmotions();
}

function supportIsrael() {
    israelSupport++;
    const decrease = Math.floor(Math.random() * 30000) + 5000;
    marketCap -= decrease;
    if (marketCap < 0) marketCap = 0;
    
    // Special effects for milestones
    if (israelSupport % 5 === 0) {
        createPatrioticConfetti(window.innerWidth * 3/4, window.innerHeight / 2);
    }
    
    if (israelSupport % 10 === 0) {
        createSpecialEffect('patriotic');
    }
    
    updateDisplays();
    updateCharacterPositions();
    updateCharacterEmotions();
}

function updateDisplays() {
    const oldMarketCap = marketCapElement.textContent;
    const oldGretaSupport = gretaSupportElement.textContent;
    const oldIsraelSupport = israelSupportElement.textContent;
    
    marketCapElement.textContent = '$' + formatNumber(marketCap);
    gretaSupportElement.textContent = gretaSupport;
    israelSupportElement.textContent = israelSupport;
    
    // Pulse animations for changes
    if (oldMarketCap !== marketCapElement.textContent) {
        pulseCounter(document.querySelector('.market-cap-display'));
    }
    if (oldGretaSupport !== gretaSupportElement.textContent) {
        pulseCounter(document.querySelector('.greta-counter'));
    }
    if (oldIsraelSupport !== israelSupportElement.textContent) {
        pulseCounter(document.querySelector('.israel-counter'));
    }
}

function updateCharacterPositions() {
    // Calculate Greta's position based on Market Cap
    // Base Market Cap: 100,000 - 10% position
    // Maximum Market Cap: 5,000,000 - 85% position
    const minCap = 100000;
    const maxCap = 5000000;
    const minPosition = 10;
    const maxPosition = 85;
    
    let newPosition = minPosition + ((marketCap - minCap) / (maxCap - minCap)) * (maxPosition - minPosition);
    newPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));
    
    currentPosition = newPosition;
    boatElement.style.left = currentPosition + '%';
}

function updateCharacterEmotions() {
    // Greta's emotions: happy if closer to Gaza (position > 50%)
    if (currentPosition > 50) {
        gretaElement.className = 'greta-character happy';
        makeCharacterSpeak(gretaElement, 'ALMOST THERE! 🚢');
    } else {
        gretaElement.className = 'greta-character sad';
        makeCharacterSpeak(gretaElement, 'SO FAR... 😢');
    }
    
    // Israeli character emotions: angry if Greta is close to Gaza
    if (currentPosition > 50) {
        israelElement.className = 'israel-character angry';
        makeCharacterSpeak(israelElement, 'OH NO! 😡');
    } else {
        israelElement.className = 'israel-character happy';
        makeCharacterSpeak(israelElement, 'PHEW! 😌');
    }
}

function addCharacterSpeechBubbles() {
    // Add speech bubbles if they don't exist
    [gretaElement, israelElement].forEach(character => {
        if (!character.querySelector('.speech-bubble')) {
            const bubble = document.createElement('div');
            bubble.className = 'speech-bubble';
            bubble.textContent = 'Click me!';
            character.appendChild(bubble);
        }
    });
}

function showClickEffect(event, text, color) {
    // Main text effect
    clickIndicator.textContent = text;
    clickIndicator.style.color = color;
    clickIndicator.style.left = event.clientX + 'px';
    clickIndicator.style.top = event.clientY + 'px';
    clickIndicator.classList.add('show');
    
    // Additional ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: ${color};
        opacity: 0.6;
        pointer-events: none;
        z-index: 999;
        animation: comicRipple 0.8s ease-out;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        clickIndicator.classList.remove('show');
        ripple.remove();
    }, 1000);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function updateMarketCapDisplay() {
    marketCapElement.textContent = '$' + formatNumber(marketCap);
}

// Market Cap simulation
function startMarketCapSimulation() {
    setInterval(() => {
        // Random Market Cap changes for demonstration
        const change = (Math.random() - 0.5) * 20000;
        marketCap += change;
        if (marketCap < 50000) marketCap = 50000;
        if (marketCap > 10000000) marketCap = 10000000;
        
        updateMarketCapDisplay();
        updateCharacterPositions();
        updateCharacterEmotions();
    }, 4000); // Update every 4 seconds
}

// Fun floating emojis
function createFloatingEmojis() {
    const emojis = ['🌍', '🌱', '⚡', '🌊', '🏛️', '⭐', '🔥', '💫'];
    const container = document.querySelector('.floating-emojis');
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: absolute;
            font-size: 2rem;
            left: ${Math.random() * 100}%;
            animation: floatUp 10s linear infinite;
            pointer-events: none;
            opacity: 0.3;
        `;
        container.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 10000);
    }, 3000);
}

// Eco-themed confetti
function createEcoConfetti(x, y) {
    const ecoEmojis = ['🌱', '🌍', '♻️', '🌿', '🍃', '💚'];
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = ecoEmojis[Math.floor(Math.random() * ecoEmojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${x + Math.random() * 60 - 30}px;
            top: ${y + Math.random() * 60 - 30}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: ecoConfetti 3s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Patriotic confetti
function createPatrioticConfetti(x, y) {
    const patrioticEmojis = ['🏛️', '⭐', '🛡️', '🗽', '🦅', '💙'];
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = patrioticEmojis[Math.floor(Math.random() * patrioticEmojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${x + Math.random() * 60 - 30}px;
            top: ${y + Math.random() * 60 - 30}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: patrioticConfetti 3s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Special effects for milestones
function createSpecialEffect(type) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
        animation: specialEffect 2s ease-out forwards;
    `;
    
    if (type === 'eco') {
        effect.textContent = '🌱 ECO POWER ACTIVATED! 🌱';
        effect.style.color = '#00b894';
    } else {
        effect.textContent = '🏛️ DEMOCRACY FORCE! 🏛️';
        effect.style.color = '#e17055';
    }
    
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 2000);
}

// Achievement system
function showAchievement(text, icon) {
    const achievement = document.createElement('div');
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #2d3436;
        padding: 20px 25px;
        border-radius: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1000;
        animation: achievementSlide 4s ease-out forwards;
        border: 4px solid #2d3436;
        box-shadow: 6px 6px 0px #fdcb6e;
        font-family: 'Fredoka One', cursive;
        max-width: 300px;
        text-align: center;
    `;
    achievement.innerHTML = `${icon}<br>${text}`;
    document.body.appendChild(achievement);
    
    setTimeout(() => achievement.remove(), 4000);
}

function checkAchievements() {
    if (gretaSupport === 5) {
        showAchievement('First Climate Warrior!', '🌱');
    }
    if (gretaSupport === 15) {
        showAchievement('Eco Squad Leader!', '⚡');
    }
    if (gretaSupport === 25) {
        showAchievement('Planet Defender!', '🌍');
    }
    if (gretaSupport === 50) {
        showAchievement('Climate Strike Force!', '💪');
    }
    if (gretaSupport === 100) {
        showAchievement('ECO LEGEND STATUS!', '👑');
    }
    
    if (israelSupport === 5) {
        showAchievement('Democracy Supporter!', '🏛️');
    }
    if (israelSupport === 15) {
        showAchievement('Freedom Fighter!', '⭐');
    }
    if (israelSupport === 25) {
        showAchievement('Liberty Guardian!', '🛡️');
    }
    if (israelSupport === 50) {
        showAchievement('Democratic Force!', '💪');
    }
    if (israelSupport === 100) {
        showAchievement('DEMOCRACY CHAMPION!', '👑');
    }
    
    // Position-based achievements
    if (currentPosition >= 80 && !window.nearGoalAchievement) {
        showAchievement('SO CLOSE TO GAZA!', '🚢');
        window.nearGoalAchievement = true;
    }
    if (currentPosition <= 15 && !window.farAwayAchievement) {
        showAchievement('Far from the goal!', '⚠️');
        window.farAwayAchievement = true;
    }
    
    // Battle achievements
    if (gretaSupport === israelSupport && gretaSupport > 10) {
        showAchievement('EPIC TIE BATTLE!', '⚖️');
    }
}

// Journey status updates
function updateJourneyStatus() {
    const journeyZone = document.querySelector('.journey-zone');
    let statusElement = document.getElementById('journeyStatus');
    
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'journeyStatus';
        statusElement.style.cssText = `
            position: absolute;
            top: -90px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            color: #2d3436;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 1rem;
            text-align: center;
            border: 3px solid #2d3436;
            box-shadow: 4px 4px 0px #fdcb6e;
            font-family: 'Fredoka One', cursive;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        `;
        journeyZone.appendChild(statusElement);
    }
    
    let statusText = '';
    if (currentPosition < 25) {
        statusText = '🚢 Far from Gaza!';
        statusElement.style.background = '#ff6b6b';
        statusElement.style.color = 'white';
    } else if (currentPosition < 50) {
        statusText = '⛵ Getting Closer!';
        statusElement.style.background = '#ffeaa7';
        statusElement.style.color = '#2d3436';
    } else if (currentPosition < 75) {
        statusText = '🏃‍♀️ Almost There!';
        statusElement.style.background = '#fdcb6e';
        statusElement.style.color = '#2d3436';
    } else {
        statusText = '🎯 SO CLOSE TO GAZA!';
        statusElement.style.background = '#00b894';
        statusElement.style.color = 'white';
    }
    
    statusElement.textContent = statusText;
}

// Counter pulse animation
function pulseCounter(counterElement) {
    counterElement.classList.add('updated');
    setTimeout(() => {
        counterElement.classList.remove('updated');
    }, 600);
}

// Update original functions with achievement checks
const originalSupportGreta = supportGreta;
const originalSupportIsrael = supportIsrael;

supportGreta = function() {
    originalSupportGreta();
    checkAchievements();
};

supportIsrael = function() {
    originalSupportIsrael();
    checkAchievements();
};

// Enhanced position updates with journey status
const originalUpdateCharacterPositions = updateCharacterPositions;
updateCharacterPositions = function() {
    originalUpdateCharacterPositions();
    updateJourneyStatus();
};

// Initialize journey status
setTimeout(updateJourneyStatus, 500);

// Add dynamic CSS animations
const additionalKeyframes = `
    @keyframes comicRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        100% {
            width: 120px;
            height: 120px;
            margin: -60px 0 0 -60px;
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-20px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes ecoConfetti {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 + 200}px) rotate(720deg) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes patrioticConfetti {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 + 200}px) rotate(-720deg) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes specialEffect {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes achievementSlide {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        10%, 85% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = additionalKeyframes;
document.head.appendChild(dynamicStyle);

// Funny random events
setInterval(() => {
    const randomEvents = [
        () => showAchievement('Random Eco Fact: Trees are cool! 🌳', '💡'),
        () => showAchievement('Fun Fact: Politics is complicated! 🤯', '💡'),
        () => showAchievement('The battle continues! ⚔️', '�'),
        () => showAchievement('Keep clicking for fun! 🎮', '✨')
    ];
    
    if (Math.random() < 0.1) { // 10% chance every interval
        const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        randomEvent();
    }
}, 15000); // Check every 15 seconds