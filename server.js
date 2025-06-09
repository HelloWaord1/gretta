const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Global game state
let globalState = {
    gretaSupport: 0,
    zettaSupport: 0,
    marketCap: 0,
    lastUpdate: Date.now(),
    tokenAddress: 'GXG4Zu7mEAKHdGVnhhy6h3bHrN5nqYpSJcyVGooiPump'
};

// Connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('🔗 New client connected');
    clients.add(ws);
    
    // Send current state to new client
    ws.send(JSON.stringify({
        type: 'stateUpdate',
        data: globalState
    }));
    
    // Handle messages from client
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleClientMessage(data, ws);
        } catch (error) {
            console.error('❌ Error parsing message:', error);
        }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
        console.log('📤 Client disconnected');
        clients.delete(ws);
    });
    
    ws.on('error', (error) => {
        console.error('🔴 WebSocket error:', error);
        clients.delete(ws);
    });
});

// Handle client messages
function handleClientMessage(data, ws) {
    switch (data.type) {
        case 'supportGreta':
            globalState.gretaSupport++;
            globalState.lastUpdate = Date.now();
            broadcastUpdate('vote', { type: 'greta', count: globalState.gretaSupport });
            break;
            
        case 'supportZetta':
            globalState.zettaSupport++;
            globalState.lastUpdate = Date.now();
            broadcastUpdate('vote', { type: 'zetta', count: globalState.zettaSupport });
            break;
            
        case 'requestState':
            ws.send(JSON.stringify({
                type: 'stateUpdate',
                data: globalState
            }));
            break;
    }
}

// Broadcast update to all clients
function broadcastUpdate(type, data) {
    const message = JSON.stringify({
        type: type,
        data: data,
        timestamp: Date.now()
    });
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Fetch token data from multiple APIs
async function fetchTokenData() {
    const tokenAddress = globalState.tokenAddress;
    
    try {
        // Try DexScreener API first
        const dexResponse = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
            timeout: 5000
        });
        
        if (dexResponse.data && dexResponse.data.pairs && dexResponse.data.pairs.length > 0) {
            const pair = dexResponse.data.pairs[0];
            const marketCap = parseFloat(pair.marketCap) || 0;
            
            console.log('📊 DexScreener Market Cap:', marketCap);
            return {
                marketCap: marketCap,
                price: parseFloat(pair.priceUsd) || 0,
                volume24h: parseFloat(pair.volume?.h24) || 0,
                source: 'DexScreener'
            };
        }
    } catch (error) {
        console.log('⚠️ DexScreener API failed:', error.message);
    }
    
    try {
        // Try pump.fun API as backup
        const pumpResponse = await axios.get(`https://frontend-api.pump.fun/coins/${tokenAddress}`, {
            timeout: 5000
        });
        
        if (pumpResponse.data) {
            const data = pumpResponse.data;
            const marketCap = parseFloat(data.market_cap) || 0;
            
            console.log('📊 Pump.fun Market Cap:', marketCap);
            return {
                marketCap: marketCap,
                price: parseFloat(data.price) || 0,
                volume24h: parseFloat(data.volume_24h) || 0,
                source: 'Pump.fun'
            };
        }
    } catch (error) {
        console.log('⚠️ Pump.fun API failed:', error.message);
    }
    
    // Fallback to simulated data
    console.log('📊 Using simulated market data');
    return {
        marketCap: globalState.marketCap || 1000000 + Math.random() * 100000,
        price: 0.001 + Math.random() * 0.01,
        volume24h: 50000 + Math.random() * 200000,
        source: 'Simulated'
    };
}

// Update market cap periodically
async function updateMarketCap() {
    try {
        const tokenData = await fetchTokenData();
        
        const oldMarketCap = globalState.marketCap;
        globalState.marketCap = tokenData.marketCap;
        globalState.lastUpdate = Date.now();
        
        // Calculate change
        const change = tokenData.marketCap - oldMarketCap;
        const changePercent = oldMarketCap ? ((change / oldMarketCap) * 100).toFixed(2) : 0;
        
        // Broadcast market cap update
        broadcastUpdate('marketCapUpdate', {
            marketCap: tokenData.marketCap,
            price: tokenData.price,
            volume24h: tokenData.volume24h,
            change: change,
            changePercent: changePercent,
            source: tokenData.source
        });
        
        // Check for significant changes and send notifications
        if (Math.abs(changePercent) > 5) {
            const direction = change > 0 ? 'up' : 'down';
            const emoji = change > 0 ? '🚀' : '📉';
            
            broadcastUpdate('notification', {
                title: `${emoji} Market Alert!`,
                message: `Market Cap ${direction} ${Math.abs(changePercent)}%`,
                type: direction === 'up' ? 'success' : 'warning'
            });
        }
        
        console.log(`📊 Market Cap Updated: $${tokenData.marketCap.toLocaleString()} (${changePercent > 0 ? '+' : ''}${changePercent}%)`);
        
    } catch (error) {
        console.error('❌ Error updating market cap:', error);
    }
}

// Monitor transactions (simulated for demo)
function monitorTransactions() {
    setInterval(() => {
        // Simulate random buy/sell events
        if (Math.random() < 0.3) { // 30% chance every 10 seconds
            const isBuy = Math.random() > 0.4; // 60% buy, 40% sell
            const amount = (Math.random() * 5000 + 1000).toFixed(2);
            const emoji = isBuy ? '💰' : '💸';
            const action = isBuy ? 'bought' : 'sold';
            const color = isBuy ? 'success' : 'info';
            
            broadcastUpdate('notification', {
                title: `${emoji} Trade Alert!`,
                message: `Someone ${action} $${amount} worth of tokens!`,
                type: color
            });
            
            console.log(`💹 Trade: ${action} $${amount}`);
        }
    }, 10000); // Every 10 seconds
}

// REST API endpoints
app.get('/api/state', (req, res) => {
    res.json(globalState);
});

app.post('/api/support', (req, res) => {
    const { type } = req.body;
    
    if (type === 'greta') {
        globalState.gretaSupport++;
        broadcastUpdate('vote', { type: 'greta', count: globalState.gretaSupport });
    } else if (type === 'zetta') {
        globalState.zettaSupport++;
        broadcastUpdate('vote', { type: 'zetta', count: globalState.zettaSupport });
    }
    
    globalState.lastUpdate = Date.now();
    res.json({ success: true, state: globalState });
});

app.get('/api/token/:address', async (req, res) => {
    try {
        const tokenData = await fetchTokenData();
        res.json({
            address: req.params.address,
            ...tokenData,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch token data' });
    }
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Monitoring token: ${globalState.tokenAddress}`);
    
    // Start market cap updates
    updateMarketCap(); // Initial update
    setInterval(updateMarketCap, 30000); // Every 30 seconds
    
    // Start transaction monitoring
    monitorTransactions();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
}); 