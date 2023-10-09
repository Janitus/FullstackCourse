require('dotenv').config();

const express = require('express');
const app = express();

const connectDB = require('./db');
const initializeMiddlewares = require('./middleware/middlewares');
const blogRoutes = require('./routes/blogRoutes');
const handleErrors = require('./errorHandlers');

connectDB();
initializeMiddlewares(app);

app.use('/', blogRoutes);
app.use(handleErrors);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});