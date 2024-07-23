/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { pino } = require('@ibm-aca/aca-wrapper-pino');
const { noir } = require('@ibm-aca/aca-wrapper-pino');

const {
  pathsToMask,
  MASKED_STRING,
  pathsToMaskMatchOnly,
  dataMaskingService
} = require('@ibm-aca/aca-data-masking-provider');

const debug = require('./debug-env');

const serializers = require('./logger-serializers');

let rootConf;
let rootLogger;
let rootName;
let loggers = {};

/**
 * Creates a logger for the given componten
 *
 * @param {String} name Component name to create the logger for
 * @param {Object} options Logger options
 * @returns Logger instance object
 */
const createLogger = (name, options = {}) => {
  if (
    !rootLogger
  ) {
    const ERROR_MESSAGE = 'Missing root logger. Did you forget to call init()?';
    throw new Error(ERROR_MESSAGE);
  }

  if (!name) {
    return rootLogger;
  }

  const key = options.subcomponent ? `${name}:${options.subcomponent}` : `${name}`;
  if (key in loggers) {
    return loggers[key];
  }

  const logger = new AcaLogger(name, options || {});
  loggers[key] = logger;

  return logger;
}

const getLogLevel = (root, component, subcomponent) => {
  const path = subcomponent ? `${root}:${component}:${subcomponent}` : `${root}:${component}`;
  if (
    debug.enabled('TRACE', path)
  ) {
    return 'trace';
  } else if (debug.enabled('DEBUG', path)) {
    return 'debug';
  } else {
    return 'info';
  }
}

/**
 * Logger initialization. Should be called once upon initialization of the app.
 *
 * @param {Object} config Application configuration object. See config/config.js
 * @param {Object} options Additional logger options.
 * @returns Logger creation function
 */
const init = (config, options, stream = process.stdout) => {
  var opts = options || {};
  rootConf = config;
  rootName = opts.name = opts.name || 'app';

  opts.streams = [{ level: 0, stream: stream }];

  opts.serializers = pino.stdSerializers;
  opts.serializers['error'] = pino.stdSerializers.err;
  opts.serializers['response'] = pino.stdSerializers.res;
  opts.serializers['update'] = serializers.update;
  opts.serializers['trace'] = serializers.trace;

  debug.update('TRACE', process.env.TRACE);
  debug.update('DEBUG', process.env.DEBUG);

  opts.level = getLogLevel(rootName);

  const PRETIFIER_ENABLED = config?.logger?.enablePrettifier;
  if (PRETIFIER_ENABLED) {
    opts.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      }
    };
  }

  if (
    !process.env.LOG_NO_MASKING
  ) {
    opts.serializers = noir(opts.serializers, pathsToMask, valToCheck => {
      if (
        Array.isArray(valToCheck)
      ) {
        valToCheck.forEach(item => {
          if (item.message && item.message.text) {
            item.message.text = MASKED_STRING;
          }
        });
        return valToCheck;
      }
      return MASKED_STRING;
    });
    opts.serializers = noir(opts.serializers, pathsToMaskMatchOnly, valToCheck => {
      if (
        typeof valToCheck === 'string'
      ) {
        return dataMaskingService.mask(valToCheck);
      }
      return dataMaskingService.maskObject(valToCheck);
    });
  }
  rootLogger = new AcaLogger('root', { logger: pino(opts, pino.multistream(opts.streams)) });
  loggers[rootName] = rootLogger;
  return createLogger;
}

class AcaLogger {

  constructor(name, options) {
    this.opts = options || {};
    this.opts.namespace = (rootConf?.namespace && rootConf.namespace()) || 'local';
    this.opts.level = getLogLevel(rootName, name, options.subcomponent);
    this.opts.component = this.opts.component || name;
    this.logger = options.logger || rootLogger.child(this.opts);
  }

  _log(level, args) {
    let msg;
    let meta;
    if (
      typeof args[0] === 'string' && args[0] && args[1]
    ) {
      [meta, ...msg] = [args[1], args[0], ...args.slice(2)];
    } else {
      [meta, ...msg] = [args[0], ...args.slice(1)];
    }

    return this.logger[level].call(this.logger, meta, ...msg);
  }

  get options() {
    return this.opts;
  }

  get levels() {
    return this.logger.levels;
  }

  get name() {
    return this.logger.name;
  }

  get level() {
    return this.logger.level;
  }

  set level(level) {
    this.logger.level = level;
  }

  isLevelEnabled(level) {
    return this.logger.isLevelEnabled(level);
  }

  isDebug() {
    return this.isLevelEnabled('debug');
  }

  isTrace() {
    return this.isLevelEnabled('trace');
  }

  fatal(...args) {
    this._log('fatal', args);
  }

  error(...args) {
    this._log('error', args);
  }
  warn(...args) {
    this._log('warn', args);
  }

  info(...args) {
    this._log('info', args);
  }

  debug(...args) {
    this._log('debug', args);
  }

  trace(...args) {
    this._log('trace', args);
  }

  child(opts) {
    return new AcaLogger(null, ramda.mergeRight(opts, { logger: this.logger.child(opts) }));
  }
}

module.exports = createLogger;
module.exports.init = init;
module.exports.enabled = debug.enabled;
module.exports.debug = (level, pattern, enabled) => {
  debug.add(level, pattern, enabled);
  ramda.forEachObjIndexed((logger, key) => (logger.level = getLogLevel(rootName, key, logger.options.subcomponent)))(
    loggers
  );
};
