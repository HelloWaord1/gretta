# 🚢 Gretta VS Zetta - Epic Battle! �

**The Ultimate Cartoon Battle Between Climate Warrior and Money Master!**

An interactive comic-style website for a cryptocurrency token that visualizes Greta Thunberg's epic journey to Gaza while battling against Zetta - the stereotypical money-loving character. Her boat movement depends on the current market capitalization, creating an epic battle between eco-warriors and money masters!

## 🎮 Epic Features

### 🚢 Dynamic Adventure
- **Greta moves RIGHT** (towards Gaza) when Market Cap is HIGH! 📈
- **Greta moves LEFT** (away from Gaza) when Market Cap is LOW! 📉
- **Super smooth cartoon animations** with comic book style effects!

### 😊 Hilarious Characters
- **Greta**: Gets SUPER HAPPY 😊 when close to Gaza, becomes ANGRY � when far away
- **Zetta (Jewish Character)**: Gets ANGRY �💢 when Greta is close to Gaza, HAPPY �💰 when she's far
- **Speech bubbles** with funny quotes like "HOW DARE YOU!" and "OY VEY!"

### 👆 Epic Battle Mechanics
- **Click LEFT side** = Support Team Greta! (+Market Cap) 🌱
- **Click RIGHT side** = Support Team Zetta! (-Market Cap) 💰
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
- **Money Confetti**: �💎🏦 when supporting Zetta
- **Character emotions** with bouncing and shaking
- **Ripple effects** on every click
- **Achievement notifications** sliding from the right

### 🏆 Achievement System
- **First Climate Warrior!** (5 Greta clicks) 🌱
- **Eco Squad Leader!** (15 Greta clicks) ⚡
- **Planet Defender!** (25 Greta clicks) 🌍
- **Climate Strike Force!** (50 Greta clicks) 💪
- **ECO LEGEND STATUS!** (100 Greta clicks) 👑

- **Money Maker!** (5 Zetta clicks) 💰
- **Business Mogul!** (15 Zetta clicks) 🏦
- **Financial Genius!** (25 Zetta clicks) 💎
- **Zetta the Great!** (50 Zetta clicks) 👑
- **MONEY MASTER SUPREME!** (100 Zetta clicks) 💸

## 🎭 Character Details

### 🌱 Greta - The Climate Warrior
- **Happy State**: When close to Gaza (position > 50%)
  - Face: 😊
  - Speech: "YES! ALMOST GAZA! 🚢"
  - Animation: Happy bouncing
- **Angry State**: When far from Gaza (position < 50%)
  - Face: 😡
  - Speech: "SO FAR FROM GAZA! 😡"
  - Animation: Angry shaking

### 💰 Zetta - The Money Master
- **Visual**: 🎩 Hat, 🧔 Beard, 💼 Suit, 💰 Money bag
- **Angry State**: When Greta is close to Gaza
  - Face: 😤💢
  - Speech: "OY VEY!", "NOT GOOD!", "BUSINESS BAD!"
  - Animation: Angry shaking
- **Happy State**: When Greta is far from Gaza
  - Face: 😊💰
  - Speech: "EXCELLENT!", "GOOD BUSINESS!", "PROFIT TIME!"
  - Animation: Happy bouncing

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
- **Character emotions** change in real-time based on position
- **Speech bubbles** with stereotypical phrases
- **Visual feedback** for every action

### 🌐 Social Media Integration
- **Telegram button** 📱 with cool hover effects
- **Twitter button** 🐦 with bird-like animations
- **Discord button** 🎮 for gaming vibes
- **Buy Token button** 🚀 Buy $GRETTA Token!

## 🎨 Technical Highlights

- **Pure HTML/CSS/JavaScript** - No frameworks needed!
- **Responsive comic design** for all devices
- **Google Fonts** (Comic Neue & Fredoka One) for that cartoon feel
- **CSS animations** with cubic-bezier timing functions
- **Emoji-powered** visual effects
- **Fixed right-side character** that doesn't interfere with center content

## 🖼️ Character Representation

### Greta
- **Primary**: Internet meme image from Know Your Meme
- **Backup**: Emoji-based character with dynamic emotions

### Zetta (Jewish Character)
- **Visual Elements**: 
  - 🎩 Top hat
  - 🧔 Beard
  - 😤💢 or 😊💰 Dynamic emotion face
  - 💼 Business suit
  - 💰 Money bag
- **Positioning**: Fixed on right side of screen
- **Speech**: Stereotypical phrases in different emotional states

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
- **Gretta quotes**: "How dare you!" notifications
- **Zetta quotes**: "Oy vey, money!" notifications  
- **Battle updates** with epic emojis
- **Fun encouragement** messages

### 🎨 Comic Book Effects
- **Halftone patterns** in the background
- **Tilted panels** for dynamic feel
- **Bold borders** and shadows
- **Bright color schemes** throughout
- **Fixed rotating elements removed** for better UX

## 🔧 Bug Fixes

- **Removed rotating elements** in center that were distracting
- **Fixed character emotion logic** - Greta happy when close to Gaza, angry when far
- **Added proper Jewish character** with stereotypical visual elements
- **Improved responsive design** for mobile devices

## ⚠️ Disclaimer

**This is a parody website for entertainment purposes only!** 😄

The site is designed to be funny and cartoon-like, featuring stereotypical character representations for comedic effect. It's not intended to make serious political or cultural statements.

## 🎮 Ready to Battle?

Fire up the server and join the most epic cartoon battle of Climate Warrior vs. Money Master! Who will win? Team Greta or Team Zetta? The fate of the Market Cap is in your hands! 

**Click, laugh, and enjoy the madness!** 🎉💥🚢💰 