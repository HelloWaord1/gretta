// Игровое состояние
let gameState = {
    marketCap: 1000000, // Начальный Market Cap
    gretaSupport: 0,
    israelSupport: 0,
    gretaPosition: 20, // Позиция в процентах (20% = начало)
    isGretaHappy: true,
    isIsraelAngry: false
};

// Элементы DOM
const elements = {
    marketCapValue: document.getElementById('marketCapValue'),
    gretaSupport: document.getElementById('gretaSupport'),
    israelSupport: document.getElementById('israelSupport'),
    gretaBoat: document.getElementById('gretaBoat'),
    gretaCharacter: document.getElementById('gretaCharacter'),
    israelCharacter: document.getElementById('israelCharacter'),
    israelZone: document.getElementById('israelZone'),
    buyTokenBtn: document.getElementById('buyTokenBtn')
};

// Инициализация игры
function initGame() {
    updateDisplay();
    setupEventListeners();
    startMarketCapSimulation();
    
    console.log('🚢 GrettaCap Voyage инициализирован!');
}

// Обновление отображения
function updateDisplay() {
    // Обновляем Market Cap
    elements.marketCapValue.textContent = formatMarketCap(gameState.marketCap);
    
    // Обновляем счетчики поддержки
    elements.gretaSupport.textContent = gameState.gretaSupport;
    elements.israelSupport.textContent = gameState.israelSupport;
    
    // Вычисляем позицию Греты на основе Market Cap
    updateGretaPosition();
    
    // Обновляем анимации персонажей
    updateCharacterAnimations();
}

// Форматирование Market Cap
function formatMarketCap(value) {
    if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(2) + 'K';
    } else {
        return '$' + value.toFixed(2);
    }
}

// Обновление позиции Греты
function updateGretaPosition() {
    // Позиция зависит от Market Cap и поддержки
    const basePosition = Math.min(Math.max(gameState.marketCap / 10000000 * 60, 5), 80);
    const supportBonus = (gameState.gretaSupport - gameState.israelSupport) * 0.1;
    
    gameState.gretaPosition = Math.min(Math.max(basePosition + supportBonus, 5), 80);
    
    // Анимируем движение лодки
    elements.gretaBoat.style.left = gameState.gretaPosition + '%';
    
    // Определяем эмоции Греты
    gameState.isGretaHappy = gameState.gretaPosition > 40;
}

// Обновление анимаций персонажей
function updateCharacterAnimations() {
    // Анимации Греты
    if (gameState.isGretaHappy) {
        elements.gretaCharacter.className = 'greta-character happy';
        elements.gretaCharacter.querySelector('.greta-face').textContent = '😊';
    } else {
        elements.gretaCharacter.className = 'greta-character sad';
        elements.gretaCharacter.querySelector('.greta-face').textContent = '😢';
    }
    
    // Анимации персонажа Израиля
    gameState.isIsraelAngry = gameState.gretaPosition > 50;
    
    if (gameState.isIsraelAngry) {
        elements.israelCharacter.className = 'israel-character angry';
        elements.israelCharacter.querySelector('.israel-face').textContent = '😡';
    } else {
        elements.israelCharacter.className = 'israel-character calm';
        elements.israelCharacter.querySelector('.israel-face').textContent = '😌';
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Клик по лодке Греты (поддержка Греты)
    elements.gretaBoat.addEventListener('click', (e) => {
        e.stopPropagation();
        supportGreta();
    });
    
    // Клик по зоне Израиля (поддержка Израиля)
    elements.israelZone.addEventListener('click', (e) => {
        e.stopPropagation();
        supportIsrael();
    });
    
    // Клик по кнопке покупки токена
    elements.buyTokenBtn.addEventListener('click', () => {
        buyToken();
    });
    
    // Клик по верхней части экрана (поддержка Греты)
    document.querySelector('.journey-zone').addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.classList.contains('journey-line') || e.target.classList.contains('journey-path')) {
            supportGreta();
        }
    });
}

// Поддержка Греты
function supportGreta() {
    gameState.gretaSupport++;
    
    // Эффект клика
    showClickEffect('💚', 'Поддержка Греты!');
    
    // Небольшое увеличение Market Cap
    gameState.marketCap += Math.random() * 10000 + 5000;
    
    updateDisplay();
    
    console.log('💚 Поддержка Греты! +1');
}

// Поддержка Израиля
function supportIsrael() {
    gameState.israelSupport++;
    
    // Эффект клика
    showClickEffect('💙', 'Поддержка Израиля!');
    
    // Небольшое уменьшение Market Cap
    gameState.marketCap -= Math.random() * 8000 + 3000;
    gameState.marketCap = Math.max(gameState.marketCap, 10000); // Минимум
    
    updateDisplay();
    
    console.log('💙 Поддержка Израиля! +1');
}

// Покупка токена
function buyToken() {
    // Значительное увеличение Market Cap
    const purchaseAmount = Math.random() * 100000 + 50000;
    gameState.marketCap += purchaseAmount;
    
    // Эффект покупки
    showClickEffect('💰', `Куплено на $${formatMarketCap(purchaseAmount)}!`);
    
    updateDisplay();
    
    console.log('💰 Токен куплен! Market Cap увеличен на', formatMarketCap(purchaseAmount));
}

// Показ эффекта клика
function showClickEffect(emoji, text) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        pointer-events: none;
        z-index: 1000;
        animation: fadeInOut 1.5s ease-out forwards;
    `;
    
    effect.innerHTML = `${emoji}<br><span style="font-size: 1rem;">${text}</span>`;
    
    // Добавляем CSS анимацию
    if (!document.querySelector('#clickEffectStyles')) {
        const style = document.createElement('style');
        style.id = 'clickEffectStyles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -70%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(effect);
    
    // Удаляем эффект через 1.5 секунды
    setTimeout(() => {
        effect.remove();
    }, 1500);
}

// Симуляция Market Cap (для демонстрации)
function startMarketCapSimulation() {
    setInterval(() => {
        // Случайные колебания Market Cap
        const change = (Math.random() - 0.5) * 20000;
        gameState.marketCap += change;
        gameState.marketCap = Math.max(gameState.marketCap, 10000); // Минимум
        
        updateDisplay();
    }, 3000); // Обновление каждые 3 секунды
}

// API для получения реального Market Cap (заглушка)
async function fetchRealMarketCap() {
    try {
        // Здесь должен быть реальный API вызов
        // Например, к CoinGecko или другому сервису
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true');
        const data = await response.json();
        
        // Для демонстрации используем данные Bitcoin
        if (data.bitcoin && data.bitcoin.usd_market_cap) {
            return data.bitcoin.usd_market_cap;
        }
    } catch (error) {
        console.error('Ошибка получения Market Cap:', error);
    }
    
    // Возвращаем симулированное значение
    return gameState.marketCap;
}

// Обновление с реального API
async function updateFromAPI() {
    const realMarketCap = await fetchRealMarketCap();
    if (realMarketCap) {
        gameState.marketCap = realMarketCap;
        updateDisplay();
    }
}

// Дополнительные эффекты
function addFloatingEmojis() {
    const emojis = ['🌊', '⛵', '🚢', '🌅', '🏴‍☠️'];
    
    setInterval(() => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const floating = document.createElement('div');
        
        floating.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            opacity: 0.3;
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: float 10s linear forwards;
        `;
        
        floating.textContent = emoji;
        
        // Добавляем CSS анимацию плавания
        if (!document.querySelector('#floatingStyles')) {
            const style = document.createElement('style');
            style.id = 'floatingStyles';
            style.textContent = `
                @keyframes float {
                    to {
                        transform: translateY(-120vh);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(floating);
        
        // Удаляем после анимации
        setTimeout(() => {
            floating.remove();
        }, 10000);
    }, 2000);
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addFloatingEmojis();
    
    // Опционально: обновление с реального API каждые 30 секунд
    // setInterval(updateFromAPI, 30000);
});

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Ошибка в игре:', e.error);
});

console.log('🚢 Скрипт GrettaCap Voyage загружен!'); 