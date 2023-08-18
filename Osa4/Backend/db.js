const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('connected to MongoDB');
    })
    .catch((error) => {
      console.error('error connecting to MongoDB:', error.message);
    });
};

module.exports = connectDB;