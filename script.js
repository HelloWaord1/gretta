// Глобальные переменные
let marketCap = 1234567;
let gretaSupport = 0;
let israelSupport = 0;
let currentPosition = 10; // Позиция Греты в процентах (10% - начальная позиция)

// Элементы DOM
const marketCapElement = document.getElementById('marketCap');
const gretaSupportElement = document.getElementById('gretaSupport');
const israelSupportElement = document.getElementById('israelSupport');
const boatElement = document.getElementById('boat');
const gretaElement = document.getElementById('greta');
const israelElement = document.getElementById('israelCharacter');
const clickIndicator = document.getElementById('clickIndicator');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startMarketCapSimulation();
});

function initializeApp() {
    updateMarketCapDisplay();
    updateCharacterPositions();
    updateCharacterEmotions();
}

function setupEventListeners() {
    // Клик по Грете для поддержки
    gretaElement.addEventListener('click', function(e) {
        e.stopPropagation();
        supportGreta();
        showClickEffect(e, 'Грета +1!', '#2196F3');
    });

    // Клик по персонажу Израиля для поддержки
    israelElement.addEventListener('click', function(e) {
        e.stopPropagation();
        supportIsrael();
        showClickEffect(e, 'Израиль +1!', '#4CAF50');
    });

    // Клик по зоне Греты (левая половина экрана)
    document.addEventListener('click', function(e) {
        const screenWidth = window.innerWidth;
        if (e.clientX < screenWidth / 2) {
            supportGreta();
            showClickEffect(e, 'Грета +1!', '#2196F3');
        } else {
            supportIsrael();
            showClickEffect(e, 'Израиль +1!', '#4CAF50');
        }
    });
}

function supportGreta() {
    gretaSupport++;
    const increase = Math.floor(Math.random() * 50000) + 10000;
    marketCap += increase;
    
    // Специальные эффекты при достижении целей
    if (gretaSupport % 10 === 0) {
        createConfetti(window.innerWidth / 4, window.innerHeight / 2, '#2196F3');
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
    
    // Специальные эффекты при достижении целей
    if (israelSupport % 10 === 0) {
        createConfetti(window.innerWidth * 3/4, window.innerHeight / 2, '#4CAF50');
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
    
    // Анимация изменений
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
    // Расчет позиции Греты на основе Market Cap
    // Базовый Market Cap: 500,000 - 10% позиция
    // Максимальный Market Cap: 5,000,000 - 90% позиция
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
    // Эмоции Греты: радость если ближе к Газе (позиция > 50%)
    if (currentPosition > 50) {
        gretaElement.className = 'greta-character happy';
    } else {
        gretaElement.className = 'greta-character sad';
    }
    
    // Эмоции персонажа Израиля: злость если Грета близко к Газе
    if (currentPosition > 50) {
        israelElement.className = 'israel-character angry';
    } else {
        israelElement.className = 'israel-character happy';
    }
}

function showClickEffect(event, text, color) {
    // Основной текстовый эффект
    clickIndicator.textContent = text;
    clickIndicator.style.color = color;
    clickIndicator.style.left = event.clientX + 'px';
    clickIndicator.style.top = event.clientY + 'px';
    clickIndicator.classList.add('show');
    
    // Дополнительный визуальный эффект
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
        animation: ripple 0.6s ease-out;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        clickIndicator.classList.remove('show');
        ripple.remove();
    }, 800);
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

// Симуляция изменения Market Cap
function startMarketCapSimulation() {
    setInterval(() => {
        // Случайные изменения Market Cap для демонстрации
        const change = (Math.random() - 0.5) * 20000;
        marketCap += change;
        if (marketCap < 50000) marketCap = 50000;
        if (marketCap > 10000000) marketCap = 10000000;
        
        updateMarketCapDisplay();
        updateCharacterPositions();
        updateCharacterEmotions();
    }, 3000); // Обновление каждые 3 секунды
}

// Функция для анимации волн (дополнительный эффект)
function createWaveEffect() {
    const journeyZone = document.querySelector('.journey-zone');
    const wave = document.createElement('div');
    wave.className = 'wave-effect';
    wave.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: wave 2s ease-in-out infinite;
        pointer-events: none;
    `;
    journeyZone.appendChild(wave);
    
    // Удаление элемента после анимации
    setTimeout(() => {
        wave.remove();
    }, 2000);
}

// CSS анимация для волн (добавляется динамически)
const waveKeyframes = `
    @keyframes wave {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;

// Добавление стилей для волн
const style = document.createElement('style');
style.textContent = waveKeyframes;
document.head.appendChild(style);

// Создание волн периодически
setInterval(createWaveEffect, 5000);

// Дополнительные визуальные эффекты
function addParticleEffect(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particle 1s ease-out forwards;
        `;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// CSS для частиц
const particleKeyframes = `
    @keyframes particle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
            opacity: 0;
        }
    }
`;

const particleStyle = document.createElement('style');
particleStyle.textContent = particleKeyframes;
document.head.appendChild(particleStyle);

// Обновленные обработчики кликов с частицами
gretaElement.addEventListener('click', function(e) {
    addParticleEffect(e.clientX, e.clientY, '#2196F3');
});

israelElement.addEventListener('click', function(e) {
    addParticleEffect(e.clientX, e.clientY, '#4CAF50');
});

// Функция для отображения статуса путешествия
function updateJourneyStatus() {
    const journeyZone = document.querySelector('.journey-zone');
    let statusElement = document.getElementById('journeyStatus');
    
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'journeyStatus';
        statusElement.style.cssText = `
            position: absolute;
            top: -80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            text-align: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        journeyZone.appendChild(statusElement);
    }
    
    let statusText = '';
    if (currentPosition < 25) {
        statusText = '🚢 Грета далеко от цели';
    } else if (currentPosition < 50) {
        statusText = '⛵ Грета приближается';
    } else if (currentPosition < 75) {
        statusText = '🏃‍♀️ Грета почти у цели!';
    } else {
        statusText = '🎯 Грета очень близко к Газе!';
    }
    
    statusElement.textContent = statusText;
}

// Обновление статуса при изменении позиции
const originalUpdateCharacterPositions = updateCharacterPositions;
updateCharacterPositions = function() {
    originalUpdateCharacterPositions();
    updateJourneyStatus();
};

// Инициализация статуса
setTimeout(updateJourneyStatus, 100);

// Функция для пульсации счетчиков
function pulseCounter(counterElement) {
    counterElement.classList.add('updated');
    setTimeout(() => {
        counterElement.classList.remove('updated');
    }, 500);
}

// Функция для создания конфетти
function createConfetti(x, y, color) {
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${x + Math.random() * 40 - 20}px;
            top: ${y + Math.random() * 40 - 20}px;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confetti 2s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// CSS для конфетти
const confettiKeyframes = `
    @keyframes confetti {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 + 100}px) rotate(720deg) scale(0);
            opacity: 0;
        }
    }
`;

const confettiStyle = document.createElement('style');
confettiStyle.textContent = confettiKeyframes;
document.head.appendChild(confettiStyle);

// Функция для отображения достижений
function showAchievement(text, icon) {
    const achievement = document.createElement('div');
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: #FFD700;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        z-index: 1000;
        animation: achievementSlide 3s ease-out forwards;
        backdrop-filter: blur(10px);
        border: 2px solid #FFD700;
    `;
    achievement.innerHTML = `${icon} ${text}`;
    document.body.appendChild(achievement);
    
    setTimeout(() => achievement.remove(), 3000);
}

// CSS для достижений
const achievementKeyframes = `
    @keyframes achievementSlide {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        10%, 90% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const achievementStyle = document.createElement('style');
achievementStyle.textContent = achievementKeyframes;
document.head.appendChild(achievementStyle);

// Проверка достижений
function checkAchievements() {
    if (gretaSupport === 25) {
        showAchievement('Первый сторонник Греты!', '🎉');
    }
    if (gretaSupport === 50) {
        showAchievement('Грета набирает популярность!', '🌟');
    }
    if (gretaSupport === 100) {
        showAchievement('Сотня сторонников Греты!', '🏆');
    }
    if (israelSupport === 25) {
        showAchievement('Поддержка Израиля растет!', '🎉');
    }
    if (israelSupport === 50) {
        showAchievement('Сильная поддержка Израиля!', '🌟');
    }
    if (israelSupport === 100) {
        showAchievement('Сотня сторонников Израиля!', '🏆');
    }
    if (currentPosition >= 80) {
        showAchievement('Грета почти у цели!', '🚢');
    }
    if (currentPosition <= 15) {
        showAchievement('Грета далеко от цели', '⚠️');
    }
}

// Обновляю оригинальные функции поддержки
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

// Функция для звуковых эффектов (если нужно)
function playSound(type) {
    // Здесь можно добавить воспроизведение звуков
    // const audio = new Audio(`sounds/${type}.mp3`);
    // audio.play().catch(e => console.log('Звук не воспроизведен:', e));
}

// CSS для ripple эффекта
const rippleKeyframes = `
    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.6;
        }
        100% {
            width: 100px;
            height: 100px;
            margin: -50px 0 0 -50px;
            opacity: 0;
        }
    }
`;

const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleKeyframes;
document.head.appendChild(rippleStyle);