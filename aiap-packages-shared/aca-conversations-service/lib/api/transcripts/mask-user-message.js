/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-service-transcripts-mask-user-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const maskUserMessage = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const UPDATE_UTTERANCE_PARAMS = {
      utterance: {
        id: params.utteranceId,
        message: params.maskTemplate,
        'raw.message.text': params.maskTemplate,
        'request.message.text': params.maskTemplate,
        'aiServiceRequest.external.input.text': params.maskTemplate,
        'aiServiceResponse.external.result.input.text': params.maskTemplate,
      }
    }
    const UPDATE_MESSAGE_PARAMS = {
      message: {
        id: params.messageId,
        message: params.maskTemplate,
      }
    }
    await Promise.all([
      DATASOURCE.utterances.saveOne(context, UPDATE_UTTERANCE_PARAMS),
      DATASOURCE.messages.saveOne(context, UPDATE_MESSAGE_PARAMS),
    ]);
    const RET_VAL = {
      messageId: params.messageId,
      utteranceId: params.utteranceId
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${maskUserMessage.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  maskUserMessage
}
