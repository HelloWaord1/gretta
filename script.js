// Global Variables
let marketCap = 1234567;
let gretaSupport = 0;
let zettaSupport = 0; // Изменил с israelSupport
let currentPosition = 10; // Greta's position in percentage (10% - starting position)

// DOM Elements
const marketCapElement = document.getElementById('marketCap');
const gretaSupportElement = document.getElementById('gretaSupport');
const zettaSupportElement = document.getElementById('israelSupport'); // Оставляю ID для совместимости
const boatElement = document.getElementById('boat');
const gretaElement = document.getElementById('greta');
const jewishElement = document.getElementById('jewishCharacter'); // Новый еврейский персонаж
const jewishEmotionElement = document.getElementById('jewishEmotion');
const jewishSpeechElement = document.getElementById('jewishSpeech');
const clickIndicator = document.getElementById('clickIndicator');

// Fun Sound Effects (text-based)
const soundEffects = {
    greta: ['💥 CLIMATE POWER!', '🌱 ECO RAGE!', '🔥 HOW DARE YOU!', '⚡ SAVE EARTH!'],
    zetta: ['💰 MONEY MONEY!', '🏦 OY VEY!', '🏦 BUSINESS!', '📈 PROFIT TIME!'],
    achievement: ['🎉 AWESOME!', '🏆 LEGENDARY!', '⚡ EPIC WIN!', '🌟 AMAZING!']
};

// Jewish character phrases
const jewishPhrases = {
    angry: ['OY VEY!', 'NOT GOOD!', 'BUSINESS BAD!', 'MONEY PROBLEMS!'],
    happy: ['EXCELLENT!', 'GOOD BUSINESS!', 'PROFIT TIME!', 'MONEY GOOD!'],
    neutral: ['WAITING...', 'BUSINESS...', 'MONEY...', 'OY...']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, hiding loading screen...');
    
    // Hide loading screen immediately
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('Loading screen hidden, starting game...');
            // Start the game
            new GretaVsZettaBattle();
        }, 1000); // Just 1 second delay
    } else {
        // No loading screen found, start game directly
        console.log('No loading screen found, starting game directly...');
        new GretaVsZettaBattle();
    }
});

class GretaVsZettaBattle {
    constructor() {
        this.marketCap = 1234567;
        this.gretaSupport = 0;
        this.israelSupport = 0;
        this.totalClicks = 0;
        this.userCount = 1337;
        this.gretaPosition = 25; // percentage across journey
        this.maxPosition = 80; // don't let boat go beyond 80%
        this.minPosition = 10; // don't let boat go below 10%
        this.lastMarketCap = this.marketCap;
        this.trendData = [];
        this.isLoaded = true; // Always loaded since we skip loading screen
        this.achievements = [];
        
        console.log('Greta VS Zetta Battle initialized!');
        this.initializeGame();
        this.bindEvents();
        this.startMarketCapSimulation();
        this.startUserCountSimulation();
        this.showWelcomeMessage();
    }

    initializeGame() {
        console.log('Initializing game...');
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        this.initializeTrendChart();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Click zones for battle
        document.addEventListener('click', (e) => {
            if (!this.isLoaded) {
                console.log('Game not loaded yet, ignoring click');
                return;
            }
            
            this.handleScreenClick(e);
        });

        // Character direct clicks for mega effects
        const gretaCharacter = document.getElementById('greta');
        const jewishCharacter = document.getElementById('jewishCharacter');

        if (gretaCharacter) {
            gretaCharacter.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleGretaClick(e);
            });
        }

        if (jewishCharacter) {
            jewishCharacter.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleZettaClick(e);
            });
        }

        // Buy token button
        const buyTokenBtn = document.querySelector('.buy-token-btn');
        if (buyTokenBtn) {
            buyTokenBtn.addEventListener('click', () => {
                this.handleBuyToken();
            });
        }

        // Social media buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(btn);
            });
        });
    }

    showWelcomeMessage() {
        console.log('Showing welcome message...');
        setTimeout(() => {
            this.createFloatingText('🎮 Battle Started!', window.innerWidth / 2, window.innerHeight / 2);
            this.showSpeechBubble('gretaSpeech', 'HOW DARE YOU!', 3000);
            this.showSpeechBubble('jewishSpeech', 'OY VEY!', 3000);
        }, 500);
    }

    handleScreenClick(e) {
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;
        const isLeftSide = clickX < screenWidth / 2;
        
        this.totalClicks++;
        this.updateTotalClicks();

        if (isLeftSide) {
            // Support Greta (increase market cap)
            this.supportGreta(e);
        } else {
            // Support Zetta (decrease market cap)
            this.supportZetta(e);
        }

        this.updateBoatPosition();
        this.updateCharacterEmotions();
        this.checkAchievements();
    }

    supportGreta(e) {
        const increase = Math.floor(Math.random() * 50000) + 25000;
        this.marketCap += increase;
        this.gretaSupport++;
        
        this.showClickIndicator(e.clientX, e.clientY, `+$${this.formatNumber(increase)}`, '#27AE60');
        this.createFloatingEmojis(e.clientX, e.clientY, ['🌱', '🌍', '💚', '✊']);
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.addTrendData();
        
        // Random Greta phrases
        const phrases = ['HOW DARE YOU!', 'SAVE THE PLANET!', 'CLIMATE ACTION NOW!', 'MY FUTURE!'];
        this.showSpeechBubble('gretaSpeech', phrases[Math.floor(Math.random() * phrases.length)], 2000);
        
        this.createBattleEffect('POW!', e.clientX, e.clientY, '#27AE60');
    }

    supportZetta(e) {
        const decrease = Math.floor(Math.random() * 40000) + 20000;
        this.marketCap = Math.max(0, this.marketCap - decrease);
        this.israelSupport++;
        
        this.showClickIndicator(e.clientX, e.clientY, `-$${this.formatNumber(decrease)}`, '#DAA520');
        this.createFloatingEmojis(e.clientX, e.clientY, ['💰', '💼', '📈', '🏦']);
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.addTrendData();
        
        // Random Zetta phrases
        const phrases = ['OY VEY!', 'BUSINESS GOOD!', 'MONEY TALKS!', 'PROFIT FIRST!'];
        this.showSpeechBubble('jewishSpeech', phrases[Math.floor(Math.random() * phrases.length)], 2000);
        
        this.createBattleEffect('BOOM!', e.clientX, e.clientY, '#DAA520');
    }

    handleGretaClick(e) {
        e.stopPropagation();
        const megaIncrease = Math.floor(Math.random() * 200000) + 100000;
        this.marketCap += megaIncrease;
        this.gretaSupport += 5;
        this.totalClicks++;
        
        this.showClickIndicator(e.clientX, e.clientY, `MEGA +$${this.formatNumber(megaIncrease)}`, '#27AE60');
        this.createFloatingEmojis(e.clientX, e.clientY, ['🚢', '🌊', '🌍', '💪', '✊']);
        this.createConfetti('#27AE60');
        
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('gretaSpeech', 'MEGA POWER!', 3000);
        this.createBattleEffect('MEGA POW!', e.clientX, e.clientY, '#27AE60');
        this.addTrendData();
    }

    handleZettaClick(e) {
        e.stopPropagation();
        const megaDecrease = Math.floor(Math.random() * 180000) + 90000;
        this.marketCap = Math.max(0, this.marketCap - megaDecrease);
        this.israelSupport += 5;
        this.totalClicks++;
        
        this.showClickIndicator(e.clientX, e.clientY, `MEGA -$${this.formatNumber(megaDecrease)}`, '#DAA520');
        this.createFloatingEmojis(e.clientX, e.clientY, ['💰', '💎', '🏦', '📊', '💼']);
        this.createConfetti('#DAA520');
        
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('jewishSpeech', 'MEGA BUSINESS!', 3000);
        this.createBattleEffect('MEGA BOOM!', e.clientX, e.clientY, '#DAA520');
        this.addTrendData();
    }

    updateMarketCapDisplay() {
        const marketCapElement = document.getElementById('marketCap');
        const capChangeElement = document.getElementById('capChange');
        
        if (marketCapElement) {
            marketCapElement.textContent = `$${this.formatNumber(this.marketCap)}`;
        }
        
        if (capChangeElement) {
            const change = this.marketCap - this.lastMarketCap;
            capChangeElement.textContent = change >= 0 ? `+$${this.formatNumber(change)}` : `-$${this.formatNumber(Math.abs(change))}`;
            capChangeElement.style.color = change >= 0 ? '#27AE60' : '#E74C3C';
        }
        
        // Update 24h volume
        const volumeElement = document.getElementById('volume24h');
        if (volumeElement) {
            const volume = Math.floor(Math.random() * 1000000) + 500000;
            volumeElement.textContent = `$${this.formatNumber(volume)}`;
        }
    }

    updateCounters() {
        const gretaSupportElement = document.getElementById('gretaSupport');
        const israelSupportElement = document.getElementById('israelSupport');
        
        if (gretaSupportElement) {
            gretaSupportElement.textContent = this.formatNumber(this.gretaSupport);
        }
        
        if (israelSupportElement) {
            israelSupportElement.textContent = this.formatNumber(this.israelSupport);
        }
        
        // Update progress bars
        this.updateProgressBars();
    }

    updateProgressBars() {
        const total = this.gretaSupport + this.israelSupport;
        if (total > 0) {
            const gretaPercent = (this.gretaSupport / total) * 100;
            const zettaPercent = (this.israelSupport / total) * 100;
            
            const gretaProgress = document.querySelector('.greta-progress');
            const zettaProgress = document.querySelector('.zetta-progress');
            
            if (gretaProgress) gretaProgress.style.width = `${gretaPercent}%`;
            if (zettaProgress) zettaProgress.style.width = `${zettaPercent}%`;
        }
    }

    updateTotalClicks() {
        const totalClicksElement = document.getElementById('totalClicks');
        if (totalClicksElement) {
            totalClicksElement.textContent = this.formatNumber(this.totalClicks);
        }
    }

    updateBoatPosition() {
        const boat = document.getElementById('boat');
        if (!boat) return;

        // Calculate position based on market cap (higher cap = closer to Gaza)
        const basePosition = 25;
        const capInfluence = Math.min(this.marketCap / 100000, 50); // Scale influence
        this.gretaPosition = Math.max(this.minPosition, Math.min(this.maxPosition, basePosition + capInfluence));
        
        boat.style.left = `${this.gretaPosition}%`;
        
        // Add some boat animation
        boat.style.transition = 'left 2s ease-in-out, transform 0.5s ease';
        const wave = Math.sin(Date.now() / 1000) * 2;
        boat.style.transform = `translateY(-50%) rotate(${wave}deg)`;
    }

    updateCharacterEmotions() {
        const gretaEmotion = document.getElementById('gretaEmotion');
        const jewishEmotion = document.getElementById('jewishEmotion');
        
        // Greta: Happy when >50% to Gaza, angry when <50%
        const gretaIsHappy = this.gretaPosition > 50;
        
        if (gretaEmotion) {
            gretaEmotion.textContent = gretaIsHappy ? '😊' : '😡';
        }
        
        // Zetta: Angry when Greta close to Gaza, happy when far
        if (jewishEmotion) {
            jewishEmotion.textContent = gretaIsHappy ? '😤💢' : '😊💰';
        }
    }

    startMarketCapSimulation() {
        setInterval(() => {
            if (!this.isLoaded) return;
            
            // Random market fluctuations
            const change = (Math.random() - 0.5) * 20000;
            this.lastMarketCap = this.marketCap;
            this.marketCap = Math.max(0, this.marketCap + change);
            
            this.updateMarketCapDisplay();
            this.updateBoatPosition();
            this.updateCharacterEmotions();
            this.addTrendData();
        }, 3000);
    }

    startUserCountSimulation() {
        setInterval(() => {
            if (!this.isLoaded) return;
            
            this.userCount += Math.floor(Math.random() * 5) - 2;
            this.userCount = Math.max(1000, this.userCount);
            
            const userCountElement = document.getElementById('userCount');
            if (userCountElement) {
                userCountElement.textContent = this.formatNumber(this.userCount);
            }
        }, 5000);
    }

    initializeTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;
        
        this.ctx = canvas.getContext('2d');
        this.trendData = Array(20).fill(this.marketCap);
    }

    addTrendData() {
        if (!this.ctx) return;
        
        this.trendData.push(this.marketCap);
        if (this.trendData.length > 20) {
            this.trendData.shift();
        }
        
        this.drawTrendChart();
    }

    drawTrendChart() {
        if (!this.ctx) return;
        
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        this.ctx.clearRect(0, 0, width, height);
        
        const max = Math.max(...this.trendData);
        const min = Math.min(...this.trendData);
        const range = max - min || 1;
        
        this.ctx.strokeStyle = '#27AE60';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.trendData.forEach((value, index) => {
            const x = (index / (this.trendData.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
    }

    showClickIndicator(x, y, text, color) {
        const indicator = document.getElementById('clickIndicator');
        if (!indicator) return;

        indicator.textContent = text;
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        indicator.style.color = color;
        indicator.style.opacity = '1';
        indicator.style.transform = 'scale(1)';

        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale(1.5) translateY(-50px)';
        }, 100);
    }

    createFloatingEmojis(x, y, emojis) {
        const container = document.querySelector('.floating-emojis');
        if (!container) return;

        emojis.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.textContent = emoji;
            element.className = 'floating-emoji';
            element.style.left = (x + (index - emojis.length/2) * 30) + 'px';
            element.style.top = y + 'px';
            
            container.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        });
    }

    createFloatingText(text, x, y) {
        const container = document.querySelector('.floating-emojis');
        if (!container) return;

        const element = document.createElement('div');
        element.textContent = text;
        element.style.position = 'absolute';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.fontSize = '2rem';
        element.style.fontWeight = 'bold';
        element.style.color = '#FF4500';
        element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        element.style.animation = 'floatUp 3s ease-out forwards';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1000';
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 3000);
    }

    createBattleEffect(text, x, y, color) {
        const container = document.querySelector('.battle-effects');
        if (!container) return;

        const element = document.createElement('div');
        element.textContent = text;
        element.style.position = 'absolute';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.fontSize = '3rem';
        element.style.fontWeight = 'bold';
        element.style.color = color;
        element.style.fontFamily = "'Fredoka One', cursive";
        element.style.textShadow = '4px 4px 8px rgba(0,0,0,0.5)';
        element.style.animation = 'floatUp 2s ease-out forwards';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1000';
        element.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 2000);
    }

    createConfetti(color) {
        const container = document.querySelector('.floating-emojis');
        if (!container) return;

        const confettiEmojis = ['💰', '💎', '🏆', '⭐', '🎉'];
        
        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            element.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            element.className = 'floating-emoji';
            element.style.left = Math.random() * window.innerWidth + 'px';
            element.style.top = Math.random() * window.innerHeight + 'px';
            element.style.fontSize = '1.5rem';
            
            container.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        }
    }

    showSpeechBubble(bubbleId, text, duration) {
        const bubble = document.getElementById(bubbleId);
        if (!bubble) return;

        bubble.textContent = text;
        bubble.classList.add('active');
        
        setTimeout(() => {
            bubble.classList.remove('active');
        }, duration);
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_click', condition: () => this.totalClicks === 1, message: '🎯 First Click!' },
            { id: 'ten_clicks', condition: () => this.totalClicks === 10, message: '🔥 Getting Hot!' },
            { id: 'hundred_clicks', condition: () => this.totalClicks === 100, message: '💯 Century!' },
            { id: 'million_market', condition: () => this.marketCap >= 10000000, message: '💎 Market Millionaire!' },
            { id: 'greta_win', condition: () => this.gretaPosition >= 75, message: '🌍 Climate Victory!' },
            { id: 'zetta_win', condition: () => this.gretaPosition <= 15, message: '💰 Money Master!' },
            { id: 'support_greta', condition: () => this.gretaSupport >= 50, message: '🌱 Greta Supporter!' },
            { id: 'support_zetta', condition: () => this.israelSupport >= 50, message: '💼 Zetta Supporter!' }
        ];

        achievements.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition()) {
                this.achievements.push(achievement.id);
                this.showAchievement(achievement.message);
            }
        });
    }

    showAchievement(message) {
        this.createFloatingText(message, window.innerWidth / 2, 100);
        this.createConfetti('#FFD700');
    }

    handleBuyToken() {
        this.createFloatingText('🚀 BUYING $GRETA TOKEN!', window.innerWidth / 2, window.innerHeight / 2);
        this.createConfetti('#FF4500');
        
        // Simulate token purchase effect
        const megaBoost = 500000;
        this.marketCap += megaBoost;
        this.gretaSupport += 10;
        this.totalClicks++;
        
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('gretaSpeech', 'THANK YOU!', 4000);
        this.addTrendData();
    }

    handleSocialClick(btn) {
        const platform = btn.querySelector('span').textContent;
        this.createFloatingText(`📱 Opening ${platform}!`, btn.offsetLeft, btn.offsetTop);
        
        // Add some social media boost
        this.marketCap += 25000;
        this.gretaSupport += 2;
        this.updateMarketCapDisplay();
        this.updateCounters();
        this.addTrendData();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Add emergency click to skip loading (just in case)
document.addEventListener('click', function emergencySkip() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && window.getComputedStyle(loadingScreen).display !== 'none') {
        console.log('Emergency skip: hiding loading screen...');
        loadingScreen.style.display = 'none';
        document.removeEventListener('click', emergencySkip);
    }
});

// Add some extra visual effects
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.01) { // 1% chance
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '1rem';
        sparkle.style.animation = 'floatUp 2s ease-out forwards';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
});

// Add pulse animation to important elements
setInterval(() => {
    const marketCapValue = document.querySelector('#marketCap');
    if (marketCapValue && Math.random() < 0.3) {
        marketCapValue.style.animation = 'none';
        setTimeout(() => {
            marketCapValue.style.animation = 'pulse 1s ease-in-out';
        }, 10);
    }
}, 5000);

// Add some random comic effects
setInterval(() => {
    if (Math.random() < 0.2) { // 20% chance every 10 seconds
        const effects = ['POW!', 'BOOM!', 'ZAP!', 'BANG!', 'CRASH!'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        const container = document.querySelector('.battle-effects');
        if (container) {
            const element = document.createElement('div');
            element.textContent = effect;
            element.style.position = 'absolute';
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.fontSize = '2rem';
            element.style.fontWeight = 'bold';
            element.style.color = 'rgba(255,255,255,0.5)';
            element.style.fontFamily = "'Fredoka One', cursive";
            element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
            element.style.animation = 'floatUp 3s ease-out forwards';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '50';
            
            container.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        }
    }
}, 10000);

// Professional error handling
window.addEventListener('error', (e) => {
    console.warn('Greta VS Zetta Battle Error:', e.error);
    // If there's an error, hide loading screen just in case
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

// Performance optimization
let lastUpdate = 0;
function optimizedUpdate(timestamp) {
    if (timestamp - lastUpdate > 16) { // ~60fps
        lastUpdate = timestamp;
        // Perform any optimized updates here
    }
    requestAnimationFrame(optimizedUpdate);
}
requestAnimationFrame(optimizedUpdate);