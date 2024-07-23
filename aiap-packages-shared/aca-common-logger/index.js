/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const mock = require('./lib/logger-mock');

module.exports = (...args) => {
  const logger = require('./lib/logger');
  return logger(...args);
};

module.exports.init = (...args) => {
  const logger = require('./lib/logger');
  return logger.init(...args);
};

module.exports.mock = mock;
