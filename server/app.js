// server/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

module.exports = app;
