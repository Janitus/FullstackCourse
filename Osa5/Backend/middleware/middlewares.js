const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
      //return authorization.substring(7);
  }
  return null;
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request);
  next()
}



const middlewares = (app) => {
  app.use(morgan('tiny'));
  app.use(cors());
  app.use(express.json());
  app.use(tokenExtractor)
};

module.exports = {
  middlewares,
  getTokenFrom
};
