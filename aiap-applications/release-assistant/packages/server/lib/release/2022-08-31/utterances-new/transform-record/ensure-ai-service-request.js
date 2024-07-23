/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-ai-service-request';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureAiServiceRequest = (params) => {
  let aiServiceRequest;
  let utterance;
  try {
    utterance = params?.utterance;
    aiServiceRequest = utterance?.aiServiceRequest;

    if (
      lodash.isEmpty(aiServiceRequest)
    ) {
      aiServiceRequest = {
        type: 'WA',
        external: {
          workspaceId: utterance.skillId,
          input: lodash.isEmpty(utterance.message) ? {} : { text: utterance.message },
          context: utterance.context,
        }
      };
    }

    utterance.aiServiceRequest = aiServiceRequest;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureAiServiceRequest.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureAiServiceRequest,
}
