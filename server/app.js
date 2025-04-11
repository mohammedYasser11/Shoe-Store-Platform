// server/app.js
const express = require('express');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoutes');
const path = require('path');

// Serve static files from the client/public folder
app.use(express.static(path.join(__dirname, '../client/public')));


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


// Health check route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

module.exports = app;
