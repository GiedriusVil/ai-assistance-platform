
/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-server-session-provider-processor-health-check-process-health-check-user-session-view';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const processHealthCheckUserSessionView = async (params) => {
   const PROVIDER = ramda.path(['provider'], params);

   const PROVIDER_CONVERSATION_ID = ramda.path(['conversationId'], PROVIDER);
   const PROVIDER_SESSION = ramda.path(['session'], PROVIDER);

   try {
      if (
         lodash.isEmpty(PROVIDER)
      ) {
         const MESSAGE = `Missing required params.provider parameter`;
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      const OUTGOING_MESSAGE = {
         message: {
            text: 'ACA_DEBUG - Please investigate data within child thread',
            attachment: {
               type: 'ACA_DEBUG',
               data: {
                  sesion: PROVIDER_SESSION
               }
            },
         },
         type: 'SYSTEM'
      }
      await PROVIDER.sendOutgoingMessage(OUTGOING_MESSAGE);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { PROVIDER_CONVERSATION_ID });
      logger.error('processHealthCheckUserSessionView', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

module.exports = {
   processHealthCheckUserSessionView,
}
