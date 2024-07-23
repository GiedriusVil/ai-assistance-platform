/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ACA_ERROR_TYPE } from './lib/aca-error-types';
import { formatIntoAcaError } from './lib/format-into-aca-error';
import { throwAcaError } from './lib/throw-aca-error';
import { createAcaError } from './lib/create-aca-error';
import { appendContextToError } from './lib/append-context-to-error';
import { appendDataToError } from './lib/append-data-to-error';
import { addUnhandledRejectionHandler } from './lib/aca-unhandled-rejecton-handler';
import { addUncaughtExceptionHandler } from './lib/aca-uncaught-exception-handler';

export {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  createAcaError,
  appendContextToError,
  appendDataToError,
  addUnhandledRejectionHandler,
  addUncaughtExceptionHandler,
}
