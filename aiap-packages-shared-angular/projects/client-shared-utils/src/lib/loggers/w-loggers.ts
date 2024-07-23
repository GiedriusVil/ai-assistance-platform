/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const PREFIX: string = '[AIAP_WBC]';

const LOGGER_TYPE = {
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  WARN: 'WARN',
};

export function _debugW(className: string, method: string, params: any = undefined) {
  const MESSAGE = `[${className}] ${method}`;
  _log(LOGGER_TYPE.DEBUG, MESSAGE, params);
}

export function _errorW(className: string, method: string, params: any = undefined) {
  const MESSAGE = `[${className}] ${method}`;
  _log(LOGGER_TYPE.ERROR, MESSAGE, params);
}

export function _warnW(className: string, method: string, params: any = undefined) {
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
