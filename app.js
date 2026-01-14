const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database simulation using JSON files
const DB_DIR = path.join(__dirname, '../database');
const DATA_FILE = path.join(DB_DIR, 'data.json');

// Initialize database
function initializeDatabase() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            users: [],
            transactions: [],
            deviceTracking: [],
            adminCredentials: {
                username: 'admin',
                password: 'admin123' // In production, this should be hashed
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read database
function readDatabase() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Write to database
function writeDatabase(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDatabase();
    
    if (username === db.adminCredentials.username && password === db.adminCredentials.password) {
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: 'admin-token-' + Date.now()
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// User management
app.post('/api/users', (req, res) => {
    const db = readDatabase();
    const newUser = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDatabase(db);
    
    res.json({ success: true, user: newUser });
});

app.get('/api/users', (req, res) => {
    const db = readDatabase();
    res.json(db.users);
});

// Transaction management
app.post('/api/transactions', (req, res) => {
    const db = readDatabase();
    const newTransaction = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.transactions.push(newTransaction);
    writeDatabase(db);
    
    res.json({ success: true, transaction: newTransaction });
});

app.get('/api/transactions', (req, res) => {
    const db = readDatabase();
    res.json(db.transactions);
});

// Device tracking
app.post('/api/devices/track', (req, res) => {
    const db = readDatabase();
    const deviceInfo = {
        id: Date.now(),
        ...req.body,
        timestamp: new Date().toISOString()
    };
    
    db.deviceTracking.push(deviceInfo);
    writeDatabase(db);
    
    res.json({ success: true, message: 'Device tracked successfully' });
});

app.get('/api/devices', (req, res) => {
    const db = readDatabase();
    res.json(db.deviceTracking);
});

// Movie data endpoints (simulated)
app.get('/api/movies', (req, res) => {
    const movies = {
        netflix: [
            { id: 1, title: "The Night Agent", platform: "Netflix", reward: 100 },
            { id: 2, title: "Stranger Things", platform: "Netflix", reward: 100 },
            { id: 3, title: "The Crown", platform: "Netflix", reward: 100 },
            { id: 4, title: "Squid Game", platform: "Netflix", reward: 100 },
            { id: 5, title: "Wednesday", platform: "Netflix", reward: 100 }
        ],
        marvel: [
            { id: 6, title: "Avengers: Endgame", platform: "Marvel", reward: 100 },
            { id: 7, title: "Spider-Man: No Way Home", platform: "Marvel", reward: 100 },
            { id: 8, title: "Black Panther", platform: "Marvel", reward: 100 },
            { id: 9, title: "Iron Man", platform: "Marvel", reward: 100 },
            { id: 10, title: "Thor: Ragnarok", platform: "Marvel", reward: 100 }
        ],
        disney: [
            { id: 11, title: "Encanto", platform: "Disney+", reward: 100 },
            { id: 12, title: "Moana", platform: "Disney+", reward: 100 },
            { id: 13, title: "Coco", platform: "Disney+", reward: 100 },
            { id: 14, title: "Frozen", platform: "Disney+", reward: 100 },
            { id: 15, title: "The Lion King", platform: "Disney+", reward: 100 }
        ]
    };
    
    res.json(movies);
});

// Wallet operations
app.post('/api/wallet/deposit', (req, res) => {
    const { userId, amount, bankDetails } = req.body;
    const db = readDatabase();
    
    // Find user and update balance
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    db.users[userIndex].walletBalance = (db.users[userIndex].walletBalance || 0) + amount;
    
    // Create transaction record
    const transaction = {
        id: Date.now(),
        userId,
        type: 'deposit',
        amount,
        bankDetails,
        status: 'completed',
        createdAt: new Date().toISOString()
    };
    
    db.transactions.push(transaction);
    writeDatabase(db);
    
    res.json({ 
        success: true, 
        newBalance: db.users[userIndex].walletBalance,
        transaction 
    });
});

app.post('/api/wallet/withdraw', (req, res) => {
    const { userId, amount, bankDetails } = req.body;
    const db = readDatabase();
    
    // Find user and check balance
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (db.users[userIndex].walletBalance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    db.users[userIndex].walletBalance -= amount;
    
    // Create transaction record
    const transaction = {
        id: Date.now(),
        userId,
        type: 'withdraw',
        amount,
        bankDetails,
        status: 'completed',
        createdAt: new Date().toISOString()
    };
    
    db.transactions.push(transaction);
    writeDatabase(db);
    
    res.json({ 
        success: true, 
        newBalance: db.users[userIndex].walletBalance,
        transaction 
    });
});

// Bank transfer simulation
app.post('/api/bank/transfer', (req, res) => {
    const { amount, fromBank, toAccount, toBank, accountName } = req.body;
    
    // Simulate bank transfer processing
    const simulatedTransfer = {
        id: Date.now(),
        amount,
        fromBank,
        toAccount,
        toBank,
        accountName,
        status: 'processing',
        reference: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: new Date().toISOString()
    };
    
    // Simulate processing delay
    setTimeout(() => {
        const db = readDatabase();
        simulatedTransfer.status = 'completed';
        db.transactions.push(simulatedTransfer);
        writeDatabase(db);
    }, 2000);
    
    res.json({ 
        success: true, 
        message: 'Transfer initiated successfully',
        transfer: simulatedTransfer 
    });
});

// Movie watching reward
app.post('/api/movies/watch', (req, res) => {
    const { userId, movieId } = req.body;
    const db = readDatabase();
    
    // Find user and credit reward
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const reward = 100;
    db.users[userIndex].walletBalance = (db.users[userIndex].walletBalance || 0) + reward;
    db.users[userIndex].moviesWatched = (db.users[userIndex].moviesWatched || 0) + 1;
    db.users[userIndex].totalEarned = (db.users[userIndex].totalEarned || 0) + reward;
    
    // Create earning transaction
    const transaction = {
        id: Date.now(),
        userId,
        type: 'earning',
        amount: reward,
        source: 'Movie Reward',
        movieId,
        status: 'completed',
        createdAt: new Date().toISOString()
    };
    
    db.transactions.push(transaction);
    writeDatabase(db);
    
    res.json({ 
        success: true, 
        reward,
        newBalance: db.users[userIndex].walletBalance,
        moviesWatched: db.users[userIndex].moviesWatched,
        transaction 
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize and start server
initializeDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Movie Wall & Wallet System running on port ${PORT}`);
    console.log(`📱 Access the application at http://localhost:${PORT}`);
    console.log(`🔐 Admin credentials: admin / admin123`);
});