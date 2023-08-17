// Handle database connection here

const mongoose = require('mongoose');
require('dotenv').config();


const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

module.exports = mongoose;
