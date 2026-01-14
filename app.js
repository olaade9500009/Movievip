// Movie Wall & Wallet System - Main JavaScript

// State Management
let state = {
    isLoggedIn: false,
    isAdmin: false,
    walletBalance: 0,
    totalEarned: 0,
    moviesWatched: 0,
    transactions: [],
    currentTransactionType: null,
    selectedBank: null,
    deviceInfo: {}
};

// Movie Data (Simulated for demo - in production, fetch from APIs)
const moviesData = {
    netflix: [
        { id: 1, title: "The Night Agent", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", platform: "Netflix" },
        { id: 2, title: "Stranger Things", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400", platform: "Netflix" },
        { id: 3, title: "The Crown", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", platform: "Netflix" },
        { id: 4, title: "Squid Game", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400", platform: "Netflix" },
        { id: 5, title: "Wednesday", poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400", platform: "Netflix" }
    ],
    marvel: [
        { id: 6, title: "Avengers: Endgame", poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400", platform: "Marvel" },
        { id: 7, title: "Spider-Man: No Way Home", poster: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400", platform: "Marvel" },
        { id: 8, title: "Black Panther", poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?w=400", platform: "Marvel" },
        { id: 9, title: "Iron Man", poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400", platform: "Marvel" },
        { id: 10, title: "Thor: Ragnarok", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400", platform: "Marvel" }
    ],
    disney: [
        { id: 11, title: "Encanto", poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400", platform: "Disney+" },
        { id: 12, title: "Moana", poster: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=400", platform: "Disney+" },
        { id: 13, title: "Coco", poster: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400", platform: "Disney+" },
        { id: 14, title: "Frozen", poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", platform: "Disney+" },
        { id: 15, title: "The Lion King", poster: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400", platform: "Disney+" }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadState();
    initializeDeviceTracking();
    if (state.isLoggedIn) {
        showDashboard();
    }
});

// Admin Login Functions
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Simulated admin authentication (in production, use proper backend)
    if (username === 'admin' && password === 'admin123') {
        state.isLoggedIn = true;
        state.isAdmin = true;
        saveState();
        closeAdminLogin();
        showDashboard();
        showNotification('Welcome back, Admin!', 'success');
    } else {
        showNotification('Invalid credentials. Try admin/admin123', 'error');
    }
}

// Dashboard Functions
function showDashboard() {
    document.getElementById('coverPage').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    updateWalletDisplay();
    loadMovies();
    loadTransactions();
    updateDeviceInfo();
}

function logout() {
    state.isLoggedIn = false;
    state.isAdmin = false;
    saveState();
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('coverPage').style.display = 'flex';
    showNotification('Logged out successfully', 'info');
}

// Navigation Functions
function showSection(section) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show corresponding section
    document.querySelectorAll('.movie-wall, .wallet-section, .device-section').forEach(s => s.classList.remove('active'));
    
    switch(section) {
        case 'movies':
            document.getElementById('moviesSection').classList.add('active');
            break;
        case 'wallet':
            document.getElementById('walletSection').classList.add('active');
            break;
        case 'transactions':
            document.getElementById('transactionsSection').classList.add('active');
            break;
        case 'devices':
            document.getElementById('devicesSection').classList.add('active');
            break;
        case 'settings':
            document.getElementById('settingsSection').classList.add('active');
            break;
    }
}

// Movie Functions
function loadMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '';
    
    // Combine all movie sources
    const allMovies = [...moviesData.netflix, ...moviesData.marvel, ...moviesData.disney];
    
    // Shuffle for variety
    const shuffledMovies = allMovies.sort(() => Math.random() - 0.5);
    
    shuffledMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <div class="reward-badge">+$100</div>
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/400x600?text=Movie'">
        <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-platform">${movie.platform}</div>
            <button class="watch-btn" onclick="watchMovie(${movie.id})">🎬 Watch Now</button>
        </div>
    `;
    return card;
}

function watchMovie(movieId) {
    // Simulate movie watching and reward
    state.walletBalance += 100;
    state.totalEarned += 100;
    state.moviesWatched++;
    
    saveState();
    updateWalletDisplay();
    
    showNotification('🎉 Movie watched! $100 added to your wallet!', 'success');
    
    // Log earning as transaction
    addTransaction({
        type: 'earning',
        bank: 'Movie Reward',
        accountName: 'System',
        accountNumber: 'N/A',
        amount: 100,
        status: 'completed',
        details: 'Reward for watching movie',
        timestamp: new Date().toISOString()
    });
}

// Wallet Functions
function updateWalletDisplay() {
    document.getElementById('walletBalance').textContent = state.walletBalance.toFixed(2);
    document.getElementById('mainBalance').textContent = state.walletBalance.toFixed(2);
    document.getElementById('totalEarned').textContent = state.totalEarned.toFixed(2);
    document.getElementById('moviesWatched').textContent = state.moviesWatched;
}

function openTransactionForm(type) {
    state.currentTransactionType = type;
    document.getElementById('transactionForm').style.display = 'block';
    
    const titles = {
        'deposit': '💵 Deposit to Wallet',
        'withdraw': '💸 Withdraw from Wallet',
        'transfer': '🔄 Transfer to Bank'
    };
    document.getElementById('transactionTitle').textContent = titles[type];
}

function closeTransactionForm() {
    document.getElementById('transactionForm').style.display = 'none';
    document.getElementById('transactionFormElement').reset();
    document.querySelectorAll('.bank-option').forEach(opt => opt.classList.remove('selected'));
    state.selectedBank = null;
}

function selectBank(bank) {
    state.selectedBank = bank;
    document.querySelectorAll('.bank-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-bank="${bank}"]`).classList.add('selected');
    document.getElementById('selectedBank').value = bank.toUpperCase();
}

function handleTransaction(event) {
    event.preventDefault();
    
    if (!state.selectedBank) {
        showNotification('Please select a bank', 'error');
        return;
    }
    
    const accountName = document.getElementById('accountName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const details = document.getElementById('transactionDetails').value;
    
    // Validate transaction
    if (state.currentTransactionType === 'withdraw' && amount > state.walletBalance) {
        showNotification('Insufficient wallet balance', 'error');
        return;
    }
    
    // Process transaction
    let transaction = {
        type: state.currentTransactionType,
        bank: state.selectedBank.toUpperCase(),
        accountName: accountName,
        accountNumber: accountNumber,
        amount: amount,
        status: 'completed',
        details: details || 'No additional details',
        timestamp: new Date().toISOString()
    };
    
    // Update wallet balance
    switch(state.currentTransactionType) {
        case 'deposit':
            state.walletBalance += amount;
            break;
        case 'withdraw':
            state.walletBalance -= amount;
            break;
        case 'transfer':
            state.walletBalance -= amount;
            break;
    }
    
    addTransaction(transaction);
    saveState();
    updateWalletDisplay();
    closeTransactionForm();
    
    showNotification(`${state.currentTransactionType.toUpperCase()} of $${amount.toFixed(2)} successful!`, 'success');
}

// Transaction Functions
function addTransaction(transaction) {
    state.transactions.unshift(transaction);
    loadTransactions();
}

function loadTransactions() {
    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';
    
    state.transactions.forEach(tx => {
        const row = document.createElement('tr');
        const date = new Date(tx.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        const statusClass = tx.status === 'completed' ? 'status-completed' : 
                           tx.status === 'pending' ? 'status-pending' : 'status-failed';
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
            <td>${tx.bank}</td>
            <td>${tx.accountName}</td>
            <td>${tx.accountNumber}</td>
            <td>$${tx.amount.toFixed(2)}</td>
            <td class="${statusClass}">${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</td>
            <td>${tx.details}</td>
        `;
        tbody.appendChild(row);
    });
}

// Device Tracking Functions
function initializeDeviceTracking() {
    // Simulate device information collection
    state.deviceInfo = {
        ip: generateRandomIP(),
        deviceName: getDeviceName(),
        deviceID: generateDeviceID(),
        imei: 'SIM-' + generateRandomIMEI(),
        lastAccess: new Date().toISOString(),
        owner: 'Olawale Abdul-Ganiyu'
    };
}

function updateDeviceInfo() {
    document.getElementById('deviceIP').textContent = state.deviceInfo.ip;
    document.getElementById('deviceName').textContent = state.deviceInfo.deviceName;
    document.getElementById('deviceID').textContent = state.deviceInfo.deviceID;
    document.getElementById('deviceIMEI').textContent = state.deviceInfo.imei;
    document.getElementById('lastAccess').textContent = new Date(state.deviceInfo.lastAccess).toLocaleString();
}

function getDeviceName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows Device';
    if (userAgent.includes('Mac')) return 'Mac Device';
    if (userAgent.includes('Android')) return 'Android Device';
    if (userAgent.includes('iOS')) return 'iOS Device';
    return 'Unknown Device';
}

function generateRandomIP() {
    return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function generateDeviceID() {
    return 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateRandomIMEI() {
    return Math.random().toString().substr(2, 15);
}

// Utility Functions
function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveState() {
    localStorage.setItem('movieWallState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('movieWallState');
    if (savedState) {
        state = { ...state, ...JSON.parse(savedState) };
    }
}

// Simulate daily movie updates (in production, this would fetch from APIs)
setInterval(() => {
    if (state.isLoggedIn) {
        loadMovies();
    }
}, 60000 * 60); // Update every hour