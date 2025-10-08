require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { router: authRoutes } = require('./routes/auth'); 
const usersRoutes = require('./routes/users');

const app = express();

const FRONTEND_ORIGINS = ['http://localhost:50812', 'http://localhost:8080'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
