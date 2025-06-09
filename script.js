// Ocean Blue Battle - Greta VS Zetta with Real Token Data

// Token configuration
const TOKEN_ADDRESS = 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk';
const API_ENDPOINTS = {
    // Try multiple APIs for better reliability
    dexscreener: `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
    jupiter: `https://price.jup.ag/v4/price?ids=${TOKEN_ADDRESS}`,
    birdeye: `https://public-api.birdeye.so/defi/token_overview?address=${TOKEN_ADDRESS}`
};

// Hide loading screen quickly
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Ocean Battle Loading...');
    
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('🌊 Ocean Battle Started!');
            new OceanBattle();
        }, 1000);
    } else {
        new OceanBattle();
    }
});

class OceanBattle {
    constructor() {
        // Battle state
        this.gretaSupport = 0;
        this.zettaSupport = 0;
        this.totalClicks = 0;
        this.userCount = 1337;
        this.gretaPosition = 25;
        this.maxPosition = 80;
        this.minPosition = 10;
        
        // Token data
        this.tokenData = {
            marketCap: 0,
            price: 0,
            volume24h: 0,
            priceChange: 0,
            lastUpdate: Date.now()
        };
        this.trendData = [];
        this.isLoaded = true;
        this.achievements = [];
        
        console.log('🌊 Ocean Battle Initialized!');
        this.initializeGame();
        this.bindEvents();
        this.startTokenDataFetching();
        this.startUserCountSimulation();
        this.showWelcomeMessage();
    }

    async fetchTokenData() {
        console.log('📊 Fetching real token data...');
        
        try {
            // Try DexScreener first (most reliable for Solana tokens)
            const response = await fetch(API_ENDPOINTS.dexscreener);
            const data = await response.json();
            
            if (data.pairs && data.pairs.length > 0) {
                const pair = data.pairs[0]; // Get the first trading pair
                this.tokenData = {
                    marketCap: parseFloat(pair.marketCap) || 0,
                    price: parseFloat(pair.priceUsd) || 0,
                    volume24h: parseFloat(pair.volume?.h24) || 0,
                    priceChange: parseFloat(pair.priceChange?.h24) || 0,
                    lastUpdate: Date.now()
                };
                
                console.log('✅ Token data fetched:', this.tokenData);
                this.updateTokenDisplay();
                return true;
            }
        } catch (error) {
            console.warn('⚠️ DexScreener failed, trying Jupiter API...');
        }
        
        try {
            // Fallback to Jupiter API
            const response = await fetch(API_ENDPOINTS.jupiter);
            const data = await response.json();
            
            if (data.data && data.data[TOKEN_ADDRESS]) {
                const tokenInfo = data.data[TOKEN_ADDRESS];
                this.tokenData = {
                    marketCap: tokenInfo.marketCap || 0,
                    price: parseFloat(tokenInfo.price) || 0,
                    volume24h: 0, // Jupiter doesn't provide volume
                    priceChange: 0, // Jupiter doesn't provide price change
                    lastUpdate: Date.now()
                };
                
                console.log('✅ Jupiter data fetched:', this.tokenData);
                this.updateTokenDisplay();
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Jupiter API failed, using simulation...');
        }
        
        // Fallback to simulation if APIs fail
        this.simulateTokenData();
        return false;
    }

    simulateTokenData() {
        // Generate realistic crypto data for demo
        const baseMarketCap = 1500000; // $1.5M
        const volatility = 0.05; // 5% volatility
        
        const change = (Math.random() - 0.5) * volatility;
        this.tokenData.marketCap = Math.max(100000, baseMarketCap * (1 + change));
        this.tokenData.price = this.tokenData.marketCap / 1000000000; // Assume 1B supply
        this.tokenData.volume24h = Math.random() * 500000 + 200000;
        this.tokenData.priceChange = change * 100;
        this.tokenData.lastUpdate = Date.now();
        
        console.log('🎲 Using simulated data:', this.tokenData);
        this.updateTokenDisplay();
    }

    updateTokenDisplay() {
        // Update Market Cap
        const marketCapElement = document.getElementById('marketCap');
        if (marketCapElement) {
            marketCapElement.textContent = `$${this.formatNumber(this.tokenData.marketCap)}`;
        }
        
        // Update Price Change
        const capChangeElement = document.getElementById('capChange');
        if (capChangeElement) {
            const change = this.tokenData.priceChange;
            capChangeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            capChangeElement.style.color = change >= 0 ? '#4CAF50' : '#F44336';
        }
        
        // Update Price
        const priceElement = document.getElementById('tokenPrice');
        if (priceElement) {
            priceElement.textContent = `$${this.tokenData.price.toFixed(6)}`;
        }
        
        // Update Volume
        const volumeElement = document.getElementById('volume24h');
        if (volumeElement) {
            volumeElement.textContent = `$${this.formatNumber(this.tokenData.volume24h)}`;
        }
        
        // Update volatility status
        const volatilityElement = document.getElementById('volatility');
        if (volatilityElement) {
            const absChange = Math.abs(this.tokenData.priceChange);
            if (absChange > 10) {
                volatilityElement.textContent = 'EXTREME 🌊';
                volatilityElement.style.color = '#F44336';
            } else if (absChange > 5) {
                volatilityElement.textContent = 'HIGH 🌊';
                volatilityElement.style.color = '#FF9800';
            } else {
                volatilityElement.textContent = 'NORMAL 🌊';
                volatilityElement.style.color = '#4CAF50';
            }
        }
        
        // Update boat position based on market cap
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        this.addTrendData();
    }

    startTokenDataFetching() {
        // Fetch immediately
        this.fetchTokenData();
        
        // Then fetch every 30 seconds
        setInterval(() => {
            this.fetchTokenData();
        }, 30000);
    }

    initializeGame() {
        console.log('🎮 Initializing ocean battle...');
        this.updateCounters();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        this.initializeTrendChart();
    }

    bindEvents() {
        console.log('🎯 Binding battle events...');
        
        // Battle click zones
        document.addEventListener('click', (e) => {
            if (!this.isLoaded) return;
            this.handleScreenClick(e);
        });

        // Character mega clicks
        const gretaCharacter = document.getElementById('greta');
        const zettaCharacter = document.getElementById('jewishCharacter');

        if (gretaCharacter) {
            gretaCharacter.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleGretaClick(e);
            });
        }

        if (zettaCharacter) {
            zettaCharacter.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleZettaClick(e);
            });
        }

        // UI buttons
        const buyTokenBtn = document.querySelector('.buy-token-btn');
        if (buyTokenBtn) {
            buyTokenBtn.addEventListener('click', () => {
                this.handleBuyToken();
            });
        }

        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(btn);
            });
        });
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.createFloatingText('� Ocean Battle Started!', window.innerWidth / 2, window.innerHeight / 2);
            this.showSpeechBubble('gretaSpeech', 'SAVE THE OCEANS!', 3000);
            this.showSpeechBubble('jewishSpeech', 'BUSINESS TIME!', 3000);
        }, 500);
    }

    handleScreenClick(e) {
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;
        const isLeftSide = clickX < screenWidth / 2;
        
        this.totalClicks++;
        this.updateTotalClicks();

        if (isLeftSide) {
            this.supportGreta(e);
        } else {
            this.supportZetta(e);
        }

        this.updateBoatPosition();
        this.updateCharacterEmotions();
        this.checkAchievements();
    }

    supportGreta(e) {
        this.gretaSupport++;
        
        this.showClickIndicator(e.clientX, e.clientY, 'Team Greta! 🌱', '#4CAF50');
        this.createFloatingEmojis(e.clientX, e.clientY, ['🌱', '�', '💚', '✊']);
        this.updateCounters();
        
        const phrases = ['SAVE THE OCEANS!', 'CLIMATE ACTION!', 'HOW DARE YOU!', 'OUR FUTURE!'];
        this.showSpeechBubble('gretaSpeech', phrases[Math.floor(Math.random() * phrases.length)], 2000);
        
        this.createBattleEffect('OCEAN POWER!', e.clientX, e.clientY, '#4CAF50');
    }

    supportZetta(e) {
        this.zettaSupport++;
        
        this.showClickIndicator(e.clientX, e.clientY, 'Team Zetta! 💼', '#FF9800');
        this.createFloatingEmojis(e.clientX, e.clientY, ['💰', '💼', '📈', '🏦']);
        this.updateCounters();
        
        const phrases = ['BUSINESS TIME!', 'PROFIT FIRST!', 'MONEY TALKS!', 'INVEST NOW!'];
        this.showSpeechBubble('jewishSpeech', phrases[Math.floor(Math.random() * phrases.length)], 2000);
        
        this.createBattleEffect('BUSINESS POWER!', e.clientX, e.clientY, '#FF9800');
    }

    handleGretaClick(e) {
        e.stopPropagation();
        this.gretaSupport += 5;
        this.totalClicks++;
        
        this.showClickIndicator(e.clientX, e.clientY, 'MEGA OCEAN POWER! 🌊', '#4CAF50');
        this.createFloatingEmojis(e.clientX, e.clientY, ['🚢', '🌊', '🌍', '💪', '⚡']);
        this.createConfetti('#4CAF50');
        
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('gretaSpeech', 'MEGA CLIMATE POWER!', 3000);
        this.createBattleEffect('OCEAN MEGA!', e.clientX, e.clientY, '#4CAF50');
    }

    handleZettaClick(e) {
        e.stopPropagation();
        this.zettaSupport += 5;
        this.totalClicks++;
        
        this.showClickIndicator(e.clientX, e.clientY, 'MEGA BUSINESS! 💼', '#FF9800');
        this.createFloatingEmojis(e.clientX, e.clientY, ['💰', '💎', '🏦', '📊', '�']);
        this.createConfetti('#FF9800');
        
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('jewishSpeech', 'MEGA BUSINESS POWER!', 3000);
        this.createBattleEffect('BUSINESS MEGA!', e.clientX, e.clientY, '#FF9800');
    }

    updateCounters() {
        const gretaSupportElement = document.getElementById('gretaSupport');
        const zettaSupportElement = document.getElementById('israelSupport');
        
        if (gretaSupportElement) {
            gretaSupportElement.textContent = this.formatNumber(this.gretaSupport);
        }
        
        if (zettaSupportElement) {
            zettaSupportElement.textContent = this.formatNumber(this.zettaSupport);
        }
        
        this.updateProgressBars();
    }

    updateProgressBars() {
        const total = this.gretaSupport + this.zettaSupport;
        if (total > 0) {
            const gretaPercent = (this.gretaSupport / total) * 100;
            const zettaPercent = (this.zettaSupport / total) * 100;
            
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

        // Position based on market cap and support ratio
        const basePosition = 25;
        const marketCapInfluence = Math.min(this.tokenData.marketCap / 1000000, 30); // Scale by millions
        const supportInfluence = (this.gretaSupport - this.zettaSupport) * 0.5;
        
        this.gretaPosition = Math.max(
            this.minPosition, 
            Math.min(this.maxPosition, basePosition + marketCapInfluence + supportInfluence)
        );
        
        boat.style.left = `${this.gretaPosition}%`;
        
        // Ocean wave animation
        boat.style.transition = 'left 2s ease-in-out, transform 0.5s ease';
        const wave = Math.sin(Date.now() / 1000) * 3;
        boat.style.transform = `translateY(-50%) rotate(${wave}deg)`;
    }

    updateCharacterEmotions() {
        const gretaEmotion = document.getElementById('gretaEmotion');
        const zettaEmotion = document.getElementById('jewishEmotion');
        
        // Greta: Happy when >50% to Gaza, angry when <50%
        const gretaIsHappy = this.gretaPosition > 50;
        
        if (gretaEmotion) {
            gretaEmotion.textContent = gretaIsHappy ? '😊' : '�';
        }
        
        // Zetta: Opposite emotions
        if (zettaEmotion) {
            zettaEmotion.textContent = gretaIsHappy ? '�' : '�';
        }
    }

    startUserCountSimulation() {
        setInterval(() => {
            if (!this.isLoaded) return;
            
            this.userCount += Math.floor(Math.random() * 7) - 3;
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
        this.trendData = Array(20).fill(this.tokenData.marketCap || 1000000);
    }

    addTrendData() {
        if (!this.ctx) return;
        
        this.trendData.push(this.tokenData.marketCap);
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
        
        this.ctx.strokeStyle = '#2196F3';
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
            indicator.style.transform = 'scale(1.2) translateY(-40px)';
        }, 100);
    }

    createFloatingEmojis(x, y, emojis) {
        const container = document.querySelector('.floating-emojis');
        if (!container) return;

        emojis.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.textContent = emoji;
            element.className = 'floating-emoji';
            element.style.left = (x + (index - emojis.length/2) * 25) + 'px';
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
        element.style.fontSize = '1.8rem';
        element.style.fontWeight = '600';
        element.style.color = '#2196F3';
        element.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
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
        element.style.fontSize = '2rem';
        element.style.fontWeight = '600';
        element.style.color = color;
        element.style.fontFamily = "'Poppins', sans-serif";
        element.style.textShadow = '0 2px 8px rgba(0,0,0,0.5)';
        element.style.animation = 'floatUp 2s ease-out forwards';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1000';
        element.style.transform = 'rotate(' + (Math.random() * 10 - 5) + 'deg)';
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 2000);
    }

    createConfetti(color) {
        const container = document.querySelector('.floating-emojis');
        if (!container) return;

        const confettiEmojis = ['🎉', '⭐', '💫', '✨', '�'];
        
        for (let i = 0; i < 12; i++) {
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
            { id: 'first_click', condition: () => this.totalClicks === 1, message: '� First Wave!' },
            { id: 'ten_clicks', condition: () => this.totalClicks === 10, message: '🔥 Ocean Heat!' },
            { id: 'hundred_clicks', condition: () => this.totalClicks === 100, message: '💯 Century Surfer!' },
            { id: 'greta_supporter', condition: () => this.gretaSupport >= 50, message: '� Climate Champion!' },
            { id: 'zetta_supporter', condition: () => this.zettaSupport >= 50, message: '� Business Mogul!' },
            { id: 'ocean_victory', condition: () => this.gretaPosition >= 75, message: '� Ocean Victory!' },
            { id: 'business_victory', condition: () => this.gretaPosition <= 15, message: '� Business Triumph!' }
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
        this.createConfetti('#2196F3');
    }

    handleBuyToken() {
        this.createFloatingText('🚀 BUYING $GRETA TOKEN!', window.innerWidth / 2, window.innerHeight / 2);
        this.createConfetti('#2196F3');
        
        // Boost for Greta
        this.gretaSupport += 10;
        this.totalClicks++;
        
        this.updateCounters();
        this.updateTotalClicks();
        this.updateBoatPosition();
        this.updateCharacterEmotions();
        
        this.showSpeechBubble('gretaSpeech', 'THANK YOU FOR SUPPORTING CLIMATE!', 4000);
    }

    handleSocialClick(btn) {
        const platform = btn.querySelector('span').textContent;
        this.createFloatingText(`🌊 Opening ${platform}!`, btn.offsetLeft, btn.offsetTop);
        
        // Small boost for interaction
        this.gretaSupport += 1;
        this.updateCounters();
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Ocean effects
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.008) { // Reduced frequency for cleaner look
        const ripple = document.createElement('div');
        ripple.textContent = '🌊';
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.fontSize = '1.2rem';
        ripple.style.animation = 'floatUp 2s ease-out forwards';
        ripple.style.zIndex = '50';
        ripple.style.opacity = '0.6';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }
});

// Clean interval effects
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 15 seconds
        const effects = ['SPLASH!', 'WAVE!', 'OCEAN!'];
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
            element.style.fontSize = '1.5rem';
            element.style.fontWeight = '600';
            element.style.color = 'rgba(33, 150, 243, 0.4)';
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.animation = 'floatUp 3s ease-out forwards';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '30';
            
            container.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        }
    }
}, 15000);

// Error handling
window.addEventListener('error', (e) => {
    console.warn('🌊 Ocean Battle Error:', e.error);
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

console.log('🌊 Ocean Battle Script Loaded!');