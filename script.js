// Морское путешествие Греты в Газу - Новая версия по ТЗ

// Конфигурация токена
const TOKEN_ADDRESS = 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk';
const API_ENDPOINTS = {
    dexscreener: `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
    jupiter: `https://price.jup.ag/v4/price?ids=${TOKEN_ADDRESS}`,
    coingecko: `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${TOKEN_ADDRESS}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
};

// Глобальные переменные игры
let gameData = {
    gretaSupport: 0,
    opponentSupport: 0,
    totalClicks: 0,
    usersOnline: 1337,
    gretaPosition: 15, // процент от начала до Газы
    tokenData: {
        marketCap: 0,
        price: 0,
        volume24h: 0,
        priceChange: 0,
        lastUpdate: 0
    }
};

// DOM элементы
const elements = {
    // Токен данные
    marketCap: document.getElementById('marketCap'),
    tokenPrice: document.getElementById('tokenPrice'),
    volume24h: document.getElementById('volume24h'),
    priceChange: document.getElementById('priceChange'),
    
    // Персонажи
    boat: document.getElementById('boat'),
    greta: document.getElementById('greta'),
    gretaEmotion: document.getElementById('gretaEmotion'),
    gretaSpeech: document.getElementById('gretaSpeech'),
    opponent: document.getElementById('opponent'),
    opponentEmotion: document.getElementById('opponentEmotion'),
    opponentSpeech: document.getElementById('opponentSpeech'),
    
    // Счетчики
    gretaSupport: document.getElementById('gretaSupport'),
    opponentSupport: document.getElementById('opponentSupport'),
    gretaProgress: document.getElementById('gretaProgress'),
    opponentProgress: document.getElementById('opponentProgress'),
    totalClicks: document.getElementById('totalClicks'),
    usersOnline: document.getElementById('usersOnline'),
    
    // Эффекты
    clickIndicator: document.getElementById('clickIndicator'),
    floatingEmojis: document.getElementById('floatingEmojis'),
    clickEffects: document.getElementById('clickEffects'),
    
    // UI
    buyToken: document.getElementById('buyToken'),
    loadingScreen: document.getElementById('loadingScreen')
};

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Запуск морского путешествия Греты...');
    
    // Скрываем загрузочный экран
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.style.display = 'none';
        }
        initializeGame();
    }, 1500);
});

// Инициализация игры
function initializeGame() {
    console.log('🎮 Инициализация игры...');
    
    // Привязываем события
    bindEvents();
    
    // Запускаем получение данных токена
    startTokenDataFetching();
    
    // Запускаем симуляцию пользователей
    startUserSimulation();
    
    // Показываем приветственное сообщение
    showWelcomeMessage();
    
    // Обновляем интерфейс
    updateUI();
    
    console.log('✅ Игра инициализирована!');
}

// Получение данных токена
async function fetchTokenData() {
    console.log('📊 Получаем данные токена...');
    
    try {
        // Пробуем DexScreener (лучший для Solana)
        const response = await fetch(API_ENDPOINTS.dexscreener);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            gameData.tokenData = {
                marketCap: parseFloat(pair.marketCap) || 0,
                price: parseFloat(pair.priceUsd) || 0,
                volume24h: parseFloat(pair.volume?.h24) || 0,
                priceChange: parseFloat(pair.priceChange?.h24) || 0,
                lastUpdate: Date.now()
            };
            
            console.log('✅ Данные токена получены:', gameData.tokenData);
            updateTokenDisplay();
            updateBoatPosition();
            return true;
        }
    } catch (error) {
        console.warn('⚠️ DexScreener недоступен, пробуем Jupiter...');
    }
    
    try {
        // Резервный Jupiter API
        const response = await fetch(API_ENDPOINTS.jupiter);
        const data = await response.json();
        
        if (data.data && data.data[TOKEN_ADDRESS]) {
            const tokenInfo = data.data[TOKEN_ADDRESS];
            gameData.tokenData = {
                marketCap: tokenInfo.marketCap || 0,
                price: parseFloat(tokenInfo.price) || 0,
                volume24h: 0,
                priceChange: 0,
                lastUpdate: Date.now()
            };
            
            console.log('✅ Jupiter данные получены:', gameData.tokenData);
            updateTokenDisplay();
            updateBoatPosition();
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Jupiter недоступен, используем симуляцию...');
    }
    
    // Симуляция если API недоступны
    simulateTokenData();
    return false;
}

// Симуляция данных токена
function simulateTokenData() {
    const baseMarketCap = 1500000; // $1.5M
    const volatility = 0.03; // 3% волатильность
    
    const change = (Math.random() - 0.5) * volatility;
    gameData.tokenData = {
        marketCap: Math.max(100000, baseMarketCap * (1 + change)),
        price: (baseMarketCap * (1 + change)) / 1000000000, // предполагаем 1B supply
        volume24h: Math.random() * 300000 + 100000,
        priceChange: change * 100,
        lastUpdate: Date.now()
    };
    
    console.log('🎲 Используем симулированные данные:', gameData.tokenData);
    updateTokenDisplay();
    updateBoatPosition();
}

// Обновление отображения токена
function updateTokenDisplay() {
    if (elements.marketCap) {
        elements.marketCap.textContent = `$${formatNumber(gameData.tokenData.marketCap)}`;
    }
    
    if (elements.tokenPrice) {
        elements.tokenPrice.textContent = `$${gameData.tokenData.price.toFixed(8)}`;
    }
    
    if (elements.volume24h) {
        elements.volume24h.textContent = `$${formatNumber(gameData.tokenData.volume24h)}`;
    }
    
    if (elements.priceChange) {
        const change = gameData.tokenData.priceChange;
        elements.priceChange.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        elements.priceChange.className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
}

// Запуск получения данных токена
function startTokenDataFetching() {
    // Получаем сразу
    fetchTokenData();
    
    // Затем каждые 30 секунд
    setInterval(() => {
        fetchTokenData();
    }, 30000);
}

// Привязка событий
function bindEvents() {
    console.log('🎯 Привязываем события...');
    
    // Клики по экрану для поддержки
    document.addEventListener('click', handleScreenClick);
    
    // Мега-клики по персонажам
    if (elements.greta) {
        elements.greta.addEventListener('click', (e) => {
            e.stopPropagation();
            handleGretaMegaClick(e);
        });
    }
    
    if (elements.opponent) {
        elements.opponent.addEventListener('click', (e) => {
            e.stopPropagation();
            handleOpponentMegaClick(e);
        });
    }
    
    // Кнопка покупки токена
    if (elements.buyToken) {
        elements.buyToken.addEventListener('click', handleBuyToken);
    }
    
    // Социальные кнопки
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSocialClick(btn);
        });
    });
}

// Обработка кликов по экрану
function handleScreenClick(e) {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    const isLeftSide = clickX < screenWidth / 2;
    
    gameData.totalClicks++;
    
    if (isLeftSide) {
        supportGreta(e);
    } else {
        supportOpponent(e);
    }
    
    updateUI();
    updateBoatPosition();
    updateCharacterEmotions();
}

// Поддержка Греты
function supportGreta(e) {
    gameData.gretaSupport++;
    
    showClickIndicator(e.clientX, e.clientY, 'Поддерживаем Грету! 🌱', '#4caf50');
    createFloatingEmojis(e.clientX, e.clientY, ['🌱', '🌊', '💚', '✊', '🌍']);
    
    const gretaPhrases = [
        'Спасем планету!',
        'Как вы смеете!',
        'Климатические действия!',
        'Наше будущее!',
        'За океаны!'
    ];
    
    showSpeechBubble('gretaSpeech', randomChoice(gretaPhrases), 2000);
    createEffect('СИЛА ПРИРОДЫ!', e.clientX, e.clientY, '#4caf50');
}

// Поддержка противника
function supportOpponent(e) {
    gameData.opponentSupport++;
    
    showClickIndicator(e.clientX, e.clientY, 'Поддерживаем Бизнес! 💰', '#ff9800');
    createFloatingEmojis(e.clientX, e.clientY, ['💰', '💼', '📈', '🏦', '💎']);
    
    const opponentPhrases = [
        'Бизнес превыше всего!',
        'Деньги решают!',
        'Прибыль важнее!',
        'Инвестируй сейчас!',
        'Капитализм рулит!'
    ];
    
    showSpeechBubble('opponentSpeech', randomChoice(opponentPhrases), 2000);
    createEffect('СИЛА ДЕНЕГ!', e.clientX, e.clientY, '#ff9800');
}

// Мега-клик по Грете
function handleGretaMegaClick(e) {
    gameData.gretaSupport += 5;
    gameData.totalClicks++;
    
    showClickIndicator(e.clientX, e.clientY, 'МЕГА ПОДДЕРЖКА ГРЕТЫ! 🌊⚡', '#4caf50');
    createFloatingEmojis(e.clientX, e.clientY, ['🚢', '🌊', '⚡', '💪', '🌟']);
    createConfetti('#4caf50');
    
    showSpeechBubble('gretaSpeech', 'МЕГА СИЛА ПРИРОДЫ!', 3000);
    createEffect('ОКЕАНСКАЯ МОЩЬ!', e.clientX, e.clientY, '#4caf50');
    
    updateUI();
    updateBoatPosition();
    updateCharacterEmotions();
}

// Мега-клик по противнику
function handleOpponentMegaClick(e) {
    gameData.opponentSupport += 5;
    gameData.totalClicks++;
    
    showClickIndicator(e.clientX, e.clientY, 'МЕГА ПОДДЕРЖКА БИЗНЕСА! 💰⚡', '#ff9800');
    createFloatingEmojis(e.clientX, e.clientY, ['💰', '💎', '🏦', '📊', '🚀']);
    createConfetti('#ff9800');
    
    showSpeechBubble('opponentSpeech', 'МЕГА СИЛА ДЕНЕГ!', 3000);
    createEffect('БИЗНЕС МОЩЬ!', e.clientX, e.clientY, '#ff9800');
    
    updateUI();
    updateBoatPosition();
    updateCharacterEmotions();
}

// Обновление позиции лодки
function updateBoatPosition() {
    if (!elements.boat) return;
    
    // Позиция зависит от Market Cap и поддержки
    const basePosition = 15;
    const marketCapInfluence = Math.min(gameData.tokenData.marketCap / 1000000, 40); // на миллионы
    const supportInfluence = (gameData.gretaSupport - gameData.opponentSupport) * 0.3;
    
    gameData.gretaPosition = Math.max(5, Math.min(85, basePosition + marketCapInfluence + supportInfluence));
    
    elements.boat.style.left = `${gameData.gretaPosition}%`;
    
    console.log(`🚢 Лодка на позиции: ${gameData.gretaPosition.toFixed(1)}%`);
}

// Обновление эмоций персонажей
function updateCharacterEmotions() {
    // Грета: радуется когда ближе к Газе (>50%)
    const gretaIsHappy = gameData.gretaPosition > 50;
    
    if (elements.gretaEmotion) {
        elements.gretaEmotion.textContent = gretaIsHappy ? '😊' : '😟';
    }
    
    // Противник: противоположные эмоции
    if (elements.opponentEmotion) {
        elements.opponentEmotion.textContent = gretaIsHappy ? '😤' : '😎';
    }
}

// Обновление UI
function updateUI() {
    // Счетчики поддержки
    if (elements.gretaSupport) {
        elements.gretaSupport.textContent = formatNumber(gameData.gretaSupport);
    }
    
    if (elements.opponentSupport) {
        elements.opponentSupport.textContent = formatNumber(gameData.opponentSupport);
    }
    
    // Общие клики
    if (elements.totalClicks) {
        elements.totalClicks.textContent = formatNumber(gameData.totalClicks);
    }
    
    // Прогресс-бары
    updateProgressBars();
}

// Обновление прогресс-баров
function updateProgressBars() {
    const total = gameData.gretaSupport + gameData.opponentSupport;
    if (total > 0) {
        const gretaPercent = (gameData.gretaSupport / total) * 100;
        const opponentPercent = (gameData.opponentSupport / total) * 100;
        
        if (elements.gretaProgress) {
            elements.gretaProgress.style.width = `${gretaPercent}%`;
        }
        
        if (elements.opponentProgress) {
            elements.opponentProgress.style.width = `${opponentPercent}%`;
        }
    }
}

// Симуляция пользователей онлайн
function startUserSimulation() {
    setInterval(() => {
        gameData.usersOnline += Math.floor(Math.random() * 10) - 5;
        gameData.usersOnline = Math.max(1000, gameData.usersOnline);
        
        if (elements.usersOnline) {
            elements.usersOnline.textContent = formatNumber(gameData.usersOnline);
        }
    }, 5000);
}

// Показать индикатор клика
function showClickIndicator(x, y, text, color) {
    if (!elements.clickIndicator) return;
    
    elements.clickIndicator.textContent = text;
    elements.clickIndicator.style.left = x + 'px';
    elements.clickIndicator.style.top = y + 'px';
    elements.clickIndicator.style.color = color;
    elements.clickIndicator.style.opacity = '1';
    elements.clickIndicator.style.transform = 'scale(1)';
    
    setTimeout(() => {
        elements.clickIndicator.style.opacity = '0';
        elements.clickIndicator.style.transform = 'scale(1.2) translateY(-40px)';
    }, 100);
}

// Создать плавающие эмодзи
function createFloatingEmojis(x, y, emojis) {
    if (!elements.floatingEmojis) return;
    
    emojis.forEach((emoji, index) => {
        const element = document.createElement('div');
        element.textContent = emoji;
        element.className = 'floating-emoji';
        element.style.left = (x + (index - emojis.length/2) * 25) + 'px';
        element.style.top = y + 'px';
        
        elements.floatingEmojis.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 3000);
    });
}

// Создать эффект
function createEffect(text, x, y, color) {
    if (!elements.clickEffects) return;
    
    const element = document.createElement('div');
    element.textContent = text;
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.fontSize = '1.5rem';
    element.style.fontWeight = '600';
    element.style.color = color;
    element.style.textShadow = '0 2px 8px rgba(0,0,0,0.5)';
    element.style.animation = 'floatUp 2s ease-out forwards';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '1000';
    element.style.transform = 'rotate(' + (Math.random() * 10 - 5) + 'deg)';
    
    elements.clickEffects.appendChild(element);
    
    setTimeout(() => {
        element.remove();
    }, 2000);
}

// Создать конфетти
function createConfetti(color) {
    if (!elements.floatingEmojis) return;
    
    const confettiEmojis = ['🎉', '⭐', '💫', '✨', '🌟'];
    
    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        element.className = 'floating-emoji';
        element.style.left = Math.random() * window.innerWidth + 'px';
        element.style.top = Math.random() * window.innerHeight + 'px';
        element.style.fontSize = '1.5rem';
        
        elements.floatingEmojis.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 3000);
    }
}

// Показать речевой пузырь
function showSpeechBubble(bubbleId, text, duration) {
    const bubble = document.getElementById(bubbleId);
    if (!bubble) return;
    
    bubble.textContent = text;
    bubble.classList.add('active');
    
    setTimeout(() => {
        bubble.classList.remove('active');
    }, duration);
}

// Приветственное сообщение
function showWelcomeMessage() {
    setTimeout(() => {
        createEffect('🌊 Морское путешествие началось!', window.innerWidth / 2, window.innerHeight / 2, '#2196f3');
        showSpeechBubble('gretaSpeech', 'Поплыли спасать планету!', 3000);
        showSpeechBubble('opponentSpeech', 'Деньги важнее всего!', 3000);
    }, 500);
}

// Обработка покупки токена
function handleBuyToken() {
    createEffect('🚀 ПОКУПАЕМ $GRETA!', window.innerWidth / 2, window.innerHeight / 2, '#2196f3');
    createConfetti('#2196f3');
    
    // Бонус для Греты
    gameData.gretaSupport += 10;
    gameData.totalClicks++;
    
    updateUI();
    updateBoatPosition();
    updateCharacterEmotions();
    
    showSpeechBubble('gretaSpeech', 'СПАСИБО ЗА ПОДДЕРЖКУ!', 4000);
}

// Обработка социальных кнопок
function handleSocialClick(btn) {
    const platform = btn.querySelector('span:last-child').textContent;
    createEffect(`🌊 Открываем ${platform}!`, btn.offsetLeft, btn.offsetTop, '#2196f3');
    
    // Маленький бонус
    gameData.gretaSupport += 1;
    updateUI();
}

// Утилиты
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Морские эффекты при движении мыши
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.005) { // 0.5% вероятность
        const ripple = document.createElement('div');
        ripple.textContent = '🌊';
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.fontSize = '1rem';
        ripple.style.animation = 'floatUp 2s ease-out forwards';
        ripple.style.zIndex = '50';
        ripple.style.opacity = '0.6';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }
});

// Случайные морские эффекты
setInterval(() => {
    if (Math.random() < 0.15) { // 15% каждые 12 секунд
        const effects = ['ВСПЛЕСК!', 'ВОЛНА!', 'ОКЕАН!'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        if (elements.clickEffects) {
            const element = document.createElement('div');
            element.textContent = effect;
            element.style.position = 'absolute';
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.fontSize = '1.2rem';
            element.style.fontWeight = '500';
            element.style.color = 'rgba(33, 150, 243, 0.4)';
            element.style.animation = 'floatUp 3s ease-out forwards';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '30';
            
            elements.clickEffects.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        }
    }
}, 12000);

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.warn('🌊 Ошибка морского путешествия:', e.error);
    if (elements.loadingScreen) {
        elements.loadingScreen.style.display = 'none';
    }
});

console.log('🌊 Скрипт морского путешествия загружен!');