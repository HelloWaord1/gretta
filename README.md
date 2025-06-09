# 🚢 GrettaCap Voyage - Epic Battle! 💥

**The Ultimate Cartoon Battle Between Climate Warrior and Political Boss!**

An interactive comic-style website for a cryptocurrency token that visualizes Greta Thunberg's epic journey to Gaza. Her boat movement depends on the current market capitalization, creating an epic battle between eco-warriors and democracy defenders!

## 🎮 Epic Features

### 🚢 Dynamic Adventure
- **Greta moves RIGHT** (towards Gaza) when Market Cap is HIGH! 📈
- **Greta moves LEFT** (away from Gaza) when Market Cap is LOW! 📉
- **Super smooth cartoon animations** with comic book style effects!

### 😊 Hilarious Characters
- **Greta**: Gets SUPER HAPPY 😊 when close to goal, becomes SAD 😢 when far away
- **Israeli Character**: Gets ANGRY 😡 when Greta is close, RELAXED 😌 when she's far
- **Speech bubbles** with funny quotes like "HOW DARE YOU!" and "NOT ON MY WATCH!"

### 👆 Epic Battle Mechanics
- **Click LEFT side** = Support Team Greta! (+Market Cap) 🌱
- **Click RIGHT side** = Support Team Israel! (-Market Cap) 🏛️
- **Awesome visual effects** with confetti, particles, and comic explosions!

### 🎉 Real-Time Madness
- **Live Market Cap display** with rainbow animations
- **Support counters** with pulse effects
- **Automatic Market Cap changes** for non-stop action
- **Achievement system** with epic rewards!

### 🎨 Comic Book Style
- **Bright rainbow background** that shifts colors
- **Comic book borders** and speech bubbles
- **Floating emojis** and sparkle effects
- **Cartoon character images** from the internet
- **Tilted panels** for that comic book feel

## 🌈 Visual Effects Madness

### ✨ Special Animations
- **Eco Confetti**: 🌱🌍♻️ when supporting Greta
- **Patriotic Confetti**: 🏛️⭐🛡️ when supporting Israel
- **Character emotions** with bouncing and shaking
- **Ripple effects** on every click
- **Achievement notifications** sliding from the right

### 🏆 Achievement System
- **First Climate Warrior!** (5 Greta clicks) �
- **Eco Squad Leader!** (15 Greta clicks) ⚡
- **Planet Defender!** (25 Greta clicks) 🌍
- **Climate Strike Force!** (50 Greta clicks) 💪
- **ECO LEGEND STATUS!** (100 Greta clicks) 👑
- And many more for Team Israel! 🏛️

## 📁 Project Structure

```
workspace/
├── index.html          # Main HTML with cartoon elements
├── styles.css          # Comic book style CSS with rainbow effects
├── script.js           # Epic JavaScript battle logic
└── README.md          # This awesome documentation
```

## 🚀 How to Launch the Battle

1. **Start local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   ```

2. **Open your browser:**
   Navigate to `http://localhost:8000` and join the epic battle!

## 🎯 Battle Mechanics

### 💰 Market Cap Magic
- **Minimum**: $100K (Greta at starting position)
- **Maximum**: $10M (Greta almost at Gaza!)
- **Dynamic calculation** with smooth sailing animations

### 🎮 Interactive Fun
- **Click anywhere** to support your team
- **Character emotions** change in real-time
- **Speech bubbles** with hilarious quotes
- **Visual feedback** for every action

### 🌐 Social Media Integration
- **Telegram button** 📱 with cool hover effects
- **Twitter button** 🐦 with bird-like animations
- **Discord button** 🎮 for gaming vibes
- **Buy Token button** 🚀 with rocket emoji!

## 🎨 Technical Highlights

- **Pure HTML/CSS/JavaScript** - No frameworks needed!
- **Responsive comic design** for all devices
- **Google Fonts** (Comic Neue & Fredoka One) for that cartoon feel
- **CSS animations** with cubic-bezier timing functions
- **Emoji-powered** visual effects
- **Internet images** for authentic character representation

## 🖼️ Character Images

The site uses cartoon images from the internet:
- **Greta**: Funny meme-style cartoon from Know Your Meme
- **Israeli Character**: Political cartoon style representation
- **Fallback emojis** if images don't load

## ⚙️ Customization

To connect real Market Cap API, edit the `startMarketCapSimulation()` function in `script.js`:

```javascript
// Replace simulation with real API call
async function fetchRealMarketCap() {
    try {
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        return data.marketCap;
    } catch (error) {
        console.error('Market Cap fetch error:', error);
        return marketCap; // Fallback to current value
    }
}
```

## 🎭 Fun Elements

### 🌟 Random Events
- **Eco facts** appear randomly
- **Political humor** notifications
- **Battle updates** with epic emojis
- **Fun encouragement** messages

### 🎨 Comic Book Effects
- **Halftone patterns** in the background
- **Tilted panels** for dynamic feel
- **Bold borders** and shadows
- **Bright color schemes** throughout

## ⚠️ Disclaimer

**This is a parody website for entertainment purposes only!** 😄

The site is designed to be funny and cartoon-like, not to make serious political statements. It's all about the fun of the epic battle between two sides!

## 🎮 Ready to Battle?

Fire up the server and join the most epic cartoon battle of Climate Warrior vs. Political Boss! Who will win? Team Greta or Team Israel? The fate of the Market Cap is in your hands! 

**Click, laugh, and enjoy the madness!** 🎉💥🚢 