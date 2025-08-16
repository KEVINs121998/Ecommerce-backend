const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', require('./routes/authRoutes')); 
app.use('/product', require('./routes/productRoutes'));

module.exports = app;
