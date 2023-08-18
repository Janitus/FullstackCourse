const morgan = require('morgan');
const cors = require('cors');

const middlewares = (app) => {
  app.use(morgan('tiny'));
  app.use(cors());
  app.use(express.json());
};

module.exports = middlewares;
