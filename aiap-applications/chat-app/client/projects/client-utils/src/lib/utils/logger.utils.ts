/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

const PREFIX: String = '[ACA]';

const LOGGER_TYPE = {
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  WARN: 'WARN'
};

export function _infoX(_class: any, method: string, params: any = undefined) {
  let tmpClassName;
  if (lodash.isString(_class)) {
    tmpClassName = _class;
  } else {
    tmpClassName = _class.getClassName();
  }
  const MESSAGE = `[${tmpClassName}] ${method}`;
  const LEVEL = localStorage.getItem('log_level');
  if (LEVEL === 'info' || true) {
    _log(LOGGER_TYPE.INFO, MESSAGE, params);
  }
}

export function _debugX(_class: any, method: string, params: any = undefined) {
  let tmpClassName;
  if (lodash.isString(_class)) {
    tmpClassName = _class;
  } else {
    tmpClassName = _class.getClassName();
  }
  const MESSAGE = `[${tmpClassName}] ${method}`;
  const LEVEL = localStorage.getItem('log_level');
  if (LEVEL === 'debug' || true) {
    _log(LOGGER_TYPE.DEBUG, MESSAGE, params);
  }
}

export function _errorX(_class: any, method: string, params: any = undefined) {
  let tmpClassName;
  if (lodash.isString(_class)) {
    tmpClassName = _class;
  } else {
    tmpClassName = _class.getClassName();
  }
  const MESSAGE = `[${tmpClassName}] ${method}`;
  const LEVEL = localStorage.getItem('log_level');
  if (LEVEL === 'error' || true) {
    _log(LOGGER_TYPE.ERROR, MESSAGE, params);
  }
}

export function _warnX(_class: any, method: string, params: any = undefined) {
  let tmpClassName;
  if (lodash.isString(_class)) {
    tmpClassName = _class;
  } else {
    tmpClassName = _class.getClassName();
  }
  const MESSAGE = `[${tmpClassName}] ${method}`;
  const LEVEL = localStorage.getItem('log_level');
  if (LEVEL === 'warn' || true) {
    _log(LOGGER_TYPE.WARN, MESSAGE, params);
  }
}

function _log(type: string, message: string, params: any = undefined) {
  if (params) {
    console.log(`${PREFIX} [${type}] ${message}`, params);
  } else {
    console.log(`${PREFIX} [${type}] ${message}`);
  }
}
