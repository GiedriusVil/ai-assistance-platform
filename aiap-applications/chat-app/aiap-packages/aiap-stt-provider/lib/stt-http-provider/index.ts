/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-stt-provider-stt-http-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { AIAPSTTProvider } from '../stt-provider';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';
class AIAPSTTHttpProvider extends AIAPSTTProvider {

  constructor() {
    super();
  }

  init() { }

  async handleIncomingAudioMessage(audioMessage) {
    try {
      const MESSAGE = `Service not implemented!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.handleIncomingAudioMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  AIAPSTTHttpProvider,
}
