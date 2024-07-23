/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const util = require('util');

let loggers = {};

module.exports = (name, init) => {
  const padEnd = (string, targetLength, padString) => {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (string.length > targetLength) {
      return string;
    } else {
      targetLength = targetLength - string.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return string + padString.slice(0, targetLength);
    }
  };

  const log = (events, tag) => (...args) => {
    events.push(`${padEnd(tag, 13)}\t${util.inspect(args, { breakLength: Infinity, depth: 2 })}`.replace(/"/g, "'"));
  };

  let logger = loggers[name];

  if (!logger || init) {
    let events = [];
    logger = {};
    logger.error = (...args) => log(events, `${padEnd(name, 8)} - [ERROR]`)(...args);
    logger.warn = (...args) => log(events, `${padEnd(name, 8)} - [WARN]`)(...args);
    logger.debug = (...args) => log(events, `${padEnd(name, 8)} - [DEBUG]`)(...args);
    logger.trace = (...args) => log(events, `${padEnd(name, 8)} - [TRACE]`)(...args);
    logger.info = (...args) => log(events, `${padEnd(name, 8)} - [INFO]`)(...args);
    logger.fatal = (...args) => log(events, `${padEnd(name, 8)} - [FATAL]`)(...args);
    logger.isLevelEnabled = () => true;
    logger.isDebug = () => true;
    logger.isTrace = () => true;
    logger.child = () => logger;
    logger.events = () => events;
    logger.name = () => name;
    logger.init = () => events.splice(0);
    loggers[name] = logger;
  }

  return logger;
};
