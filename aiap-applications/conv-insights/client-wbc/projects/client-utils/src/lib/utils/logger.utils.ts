/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const PREFIX: string = '[ACA_WBC]';

const LOGGER_TYPE = {
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  WARN: 'WARN',
};

export function _debugX(className: string, method: string, params: any = undefined) {
  const MESSAGE = `[${className}] ${method}`;
  _log(LOGGER_TYPE.DEBUG, MESSAGE, params);
}

export function _errorX(className: string, method: string, params: any = undefined) {
  const MESSAGE = `[${className}] ${method}`;
  _log(LOGGER_TYPE.ERROR, MESSAGE, params);
}

export function _warnX(className: string, method: string, params: any = undefined) {
  const MESSAGE = `[${className}] ${method}`;
  _log(LOGGER_TYPE.WARN, MESSAGE, params);
}


function _log(type: string, message: string, params: any = undefined) {
  if (params) {
    console.log(`${PREFIX} [${type}] ${message}`, params);
  } else {
    console.log(`${PREFIX} [${type}] ${message}`);
  }
}

// THIS_PART_OF_CODE_WILL_BE_DEPRECATED --- START
export function _info(message: string, params: any = undefined) {
  _log(LOGGER_TYPE.INFO, message, params);
}

export function _debug(message: string, params: any = undefined) {
  _log(LOGGER_TYPE.DEBUG, message, params);
}

export function _warn(message: string, params: any = undefined) {
  const TYPE = 'WARN';
  _log(TYPE, message, params);
}

export function _error(message: string, params: any = undefined) {
  _log(LOGGER_TYPE.ERROR, message, params);
}

export function info(message: string, params: any) {
  console.log(`${PREFIX} [INFO] ${message}`, params);
}

export function debug(message: string, params: any) {
  console.log(`${PREFIX} [DEBUG] ${message}`, params);
}

export function error(message: string, params: any) {
  console.log(`${PREFIX} [ERROR] ${message}`, params);
}
// THIS_PART_OF_CODE_WILL_BE_DEPRECATED --- END
