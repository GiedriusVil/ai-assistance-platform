/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-python-wrapper-learn';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { spawn } = require('child_process');
const { once } = require('events');
const lodash = require('lodash');
const ramda = require('ramda');

const convertBufferToString = (buffer) => {
  let retVal;
  if (lodash.isBuffer(buffer)) {
    retVal = buffer.toString();
  }
  return retVal;
}

const SKLearn = (module, estimator, methods, cb) => {
  const RET_VAL = new Promise((resolve, reject) => {
    cb = cb || function (results) { return results };
    let python = spawn('python3', [__dirname + '/lib/exec.py']);
    let arg = JSON.stringify([module, estimator, methods]);
    // SAST_FIX - Document.write
    python.stdin['write'](arg);
    python.stdin.end();
    let output = '';
    python.stdout.on('data', function (data) {
      output += data;
    });
    const ERRORS = [];
    python.on('error', (err) => {
      const ACA_ERROR = {
        type: 'PYTHON_ERROR',
        message: `[${MODULE_ID}] ${err}`
      }
      logger.error('on_python_error', { ACA_ERROR });
      ERRORS.push(ACA_ERROR);
    });
    python.stdout.on('close', (code) => {
      logger.info('on_python_close', { code });
    });
    python.stderr.on('data', (data) => {
      const ACA_ERROR = {
        type: 'PYTHON_ERROR',
        message: `[${MODULE_ID}] ${convertBufferToString(data)}`
      }
      logger.error('on_python_stderr', { ACA_ERROR });
      ERRORS.push(ACA_ERROR);
    })
    once(python, 'close').then((result) => {
      logger.info('once_close_event', { result });
      const EXECUTION_STATE = ramda.path([0], result);
      if (EXECUTION_STATE === 0) {
        logger.info('result', { output_to_string: convertBufferToString(output) });
        resolve(output);
      } else {
        reject(ERRORS);
      }
    }).catch((err) => {
      const ACA_ERROR = {
        type: 'ONCE_ERROR',
        message: `[${MODULE_ID}] ${err}`
      }
      logger.info('once_error_event', { ACA_ERROR });
      ERRORS.push(ACA_ERROR);
      reject(ERRORS);
    });
  });
  return RET_VAL;
};

module.exports = {
  SKLearn,
};
