/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
const PREFIX:String = '[ACA]';

const LOGGER_TYPE = {
    INFO: 'INFO', 
    DEBUG: 'DEBUG', 
    ERROR: 'ERROR', 
    WARN: 'WARN',
}

export function _info(message:string, params:any = undefined) {
    _log(LOGGER_TYPE.INFO, message, params);
}

export function _debug(message:string, params:any = undefined) {
    _log(LOGGER_TYPE.DEBUG, message, params);
}

export function _debugX( className:string, method:string, params:any=undefined) {
    const MESSAGE = `[${className}] ${method}`;
    _log(LOGGER_TYPE.DEBUG, MESSAGE, params);
}

export function _warn(message:string, params:any = undefined) {
    const TYPE = 'WARN';
    _log(TYPE, message, params);
}

export function _error(message:string, params:any = undefined) {
    const TYPE = 'ERROR';
    _log(TYPE, message, params);
}

function _log(type:string, message:string, params:any = undefined) {
    if (params) {
        console.log(`${PREFIX} [${type}] ${message}`, params);
    } else {
        console.log(`${PREFIX} [${type}] ${message}`);
    }
}

export function info(message:string, params:any) {
    console.log(`${PREFIX} [INFO] ${message}`, params);
}

export function debug(message:string, params:any) {
    console.log(`${PREFIX} [DEBUG] ${message}`, params);
}

export function error(message:string, params:any) {
    console.log(`${PREFIX} [ERROR] ${message}`, params);
}
