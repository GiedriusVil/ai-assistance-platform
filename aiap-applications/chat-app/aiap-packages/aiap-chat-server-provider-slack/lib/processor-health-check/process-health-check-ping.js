
/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-health-check-process-health-check-ping';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const processHealthCheckPing = async (params) => {
   const SESSION_PROVIDER = ramda.path(['provider'], params);
   try {
      if (
         lodash.isEmpty(SESSION_PROVIDER)
      ) {
         const MESSAGE = `Missing required params.provider.client parameter`;
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      const OUTGOING_MESSAGE = { message: { text: 'PONG' } }
      await SESSION_PROVIDER.sendOutgoingMessage(OUTGOING_MESSAGE);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('processHealthCheckPing', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

module.exports = {
   processHealthCheckPing,
}
