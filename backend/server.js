require('dotenv').config(); // Load .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const initiativeRoutes = require('./routes/initiative');
const weatherRoutes = require('./routes/weather');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbot');
const publicRoutes = require('./routes/public');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/climate_portal";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Add this line

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// Handle other routes by serving the appropriate HTML file
app.get('/initiatives.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'initiatives.html'));
});

app.get('/articles.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'articles.html'));
});

app.get('/weather.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'weather.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/login_new.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login_new.html'));
});

app.get('/user.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'user.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

app.get('/admin_new.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin_new.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

app.get('/weather-test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'weather-test.html'));
});

app.get('/test_login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'test_login.html'));
});

// Test endpoint to check database connection
app.get('/api/test', async (req, res) => {
    try {
        const User = require('./models/User');
        const userCount = await User.countDocuments();
        res.json({ 
            message: 'Database connected', 
            userCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Database error', 
            error: error.message 
        });
    }
});

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB error:', err));
