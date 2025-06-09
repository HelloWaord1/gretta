# ⚡ Greta vs Zetta - Real-time Crypto Battle

Interactive crypto token visualization with real-time market data and synchronized voting across all users.

## 🚀 Features

- **Real-time Market Cap**: Live data from DexScreener and Pump.fun APIs
- **Synchronized Voting**: All users see the same vote counts in real-time
- **Live Notifications**: Trade alerts and market updates
- **Modern UI**: Glassmorphism design with smooth animations
- **Mobile Responsive**: Works perfectly on all devices
- **WebSocket Connection**: Real-time data synchronization

## 🛠️ Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HelloWaord1/gretta.git
cd gretta
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**

**Option A: Full stack (recommended)**
```bash
npm run dev:full
```
This starts both the WebSocket server (port 3001) and Vite dev server (port 5173)

**Option B: Separate terminals**

Terminal 1 - Start server:
```bash
npm run server
```

Terminal 2 - Start frontend:
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🎮 How to Play

### Voting
- **Click Greta** (character or support card) → Increases Greta support
- **Click Zetta** (character or support card) → Increases Zetta support
- **Keyboard shortcuts**: `G` for Greta, `Z` for Zetta, `B` to open DexScreener

### Real-time Features
- **Market Cap**: Updates every 30 seconds from live APIs
- **Vote Counts**: Synchronized across all users instantly
- **Notifications**: Trade alerts and market movements
- **Connection Status**: Green dot = live data, Red dot = offline

### Character Behavior
- **Greta**: Happy when Market Cap > $5M, sad when lower
- **Zetta**: Angry when Market Cap > $7M, calm when lower  
- **Position**: Based ONLY on Market Cap (0$ = Start, $10M = Israel)

### Progress Visualization
- **Start Point**: $0 Market Cap
- **$2M Marker**: Regular progress indicator
- **$5M Milestone**: 😊 Greta becomes happy (animated glow)
- **$7M Milestone**: 😡 Zetta becomes angry (animated glow)  
- **End Point**: $10M = Israel destination

## 🔧 Configuration

### Token Address
Current token: `GXG4Zu7mEAKHdGVnhhy6h3bHrN5nqYpSJcyVGooiPump`

To change the token, edit `server.js`:
```javascript
tokenAddress: 'YOUR_TOKEN_ADDRESS_HERE'
```

### API Sources
1. **DexScreener** (primary): `https://api.dexscreener.com`
2. **Pump.fun** (backup): `https://frontend-api.pump.fun`
3. **Simulated** (fallback): Random data if APIs fail

## 📡 API Endpoints

### REST API
- `GET /api/state` - Current game state
- `POST /api/support` - Submit vote (body: `{type: 'greta'|'zetta'}`)
- `GET /api/token/:address` - Token data

### WebSocket Events
- `stateUpdate` - Initial state sync
- `vote` - Live vote updates
- `marketCapUpdate` - Market cap changes
- `notification` - Trade alerts and notifications

## 🏗️ Architecture

```
Frontend (Vite + Vanilla JS)
    ↕ WebSocket
Backend (Node.js + Express + WS)
    ↕ HTTP APIs
External APIs (DexScreener, Pump.fun)
```

### Key Components
- **WebSocket Server**: Real-time communication
- **Market Data Fetcher**: Multi-source API integration
- **Vote Synchronization**: Global state management
- **Notification System**: Live alerts and updates

## 🎨 UI/UX Features

- **Glassmorphism**: Modern translucent design
- **CSS Custom Properties**: Consistent theming
- **Inter Font**: Professional typography
- **Responsive Grid**: Mobile-first approach
- **Smooth Animations**: 60fps performance
- **Visual Feedback**: Click effects and notifications

## 🔒 Security

- **CORS Enabled**: Cross-origin requests allowed
- **Input Validation**: Server-side message validation
- **Error Handling**: Graceful fallbacks
- **Rate Limiting**: Built-in WebSocket protection

## 📱 Mobile Support

- Touch-optimized interactions
- Responsive breakpoints
- Optimized animations
- Reduced motion support

## 🚀 Deployment

### Development
```bash
npm run dev:full
```

### Production
```bash
npm run build
npm start
```

### Environment Variables
```bash
PORT=3001                    # Server port
NODE_ENV=production         # Environment
TOKEN_ADDRESS=...           # Default token
```

## 🐛 Troubleshooting

### Common Issues

**WebSocket connection failed**
- Check if server is running on port 3001
- Verify firewall settings
- Try refreshing the page

**Market data not updating**
- APIs might be rate-limited
- Check console for error messages
- Fallback to simulated data automatically

**Votes not syncing**
- Ensure WebSocket connection is active
- Check connection indicator (top-left)
- Votes work offline but won't sync

### Debug Mode
Open browser console to see detailed logs:
- 🔗 Connection events
- 📊 Market data updates
- 💚/💙 Vote submissions
- ❌ Error messages

## 📊 Performance

- **WebSocket**: < 1ms latency for votes
- **Market Updates**: 30-second intervals
- **Bundle Size**: < 500KB total
- **Memory Usage**: < 50MB typical

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use and modify!

## 🔗 Links

- **Repository**: https://github.com/HelloWaord1/gretta
- **Live Demo**: http://localhost:5173 (when running)
- **Token Info**: Check DexScreener for current data

---

**Made with ⚡ by the Greta vs Zetta team** 