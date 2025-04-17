const express = require('express');
const app = express();
const db = require('./models/index.model');
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'online-food-cbac0',
});
require('dotenv').config();
app.use(cors());
app.use(express.json());
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully.');
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err);
  });
app.use('', require('./routes'));
app.get('/', (req, res) => {
  res.send('Welcome to Foody App Server!');
});

module.exports = app
