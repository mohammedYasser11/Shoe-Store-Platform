// server/app.js
const express = require('express');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

// Serve static files from the client/public folder
app.use(express.static(path.join(__dirname, '../client/public')));


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes );
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);




// Health check route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

module.exports = app;
