const app = require('./apps');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
