require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport');
require('./models/DailyLog');
const app = express();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.use(cors());
app.use(express.json());

app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const learningPathRoutes = require('./routes/learningPath');
const resourceRoutes = require('./routes/resource');
const githubRoutes = require('./routes/github');
const productivityRoutes = require('./routes/productivity');
const connectionRoutes = require('./routes/connections');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/resource', resourceRoutes);
app.use('/api/user', githubRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/connections', connectionRoutes);
app.get('/', (req, res) => {
  res.send('EduWise API is running!');
});

// Catch-all 404 handler for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});