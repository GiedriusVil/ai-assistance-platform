/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-ai-service-response';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureAiServiceResponse = (params) => {
  let aiServiceResponse;
  let utterance;
  try {
    utterance = params?.utterance;
    aiServiceResponse = utterance?.aiServiceResponse;

    if (
      lodash.isEmpty(aiServiceResponse)
    ) {
      aiServiceResponse = {
        type: 'WA',
        external: {
          headers: {
            "access-control-allow-methods": "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS"
          },
          result: {
            intents: utterance.intents?.map((intent) => {
              return {
                intent: intent.intent,
                confidence: intent.score
              };
            }) || [],
            entities: utterance.entities?.map((entity) => {
              return {
                entity: entity.entity,
                confidence: entity.score,
              };
            }) || [],
            input: lodash.isEmpty(utterance.message) ? {} : { text: utterance.message },
            output: {
              nodes_visited: utterance.dialogNodes,
              text: [utterance.response],
            },
            context: utterance.context,
          }
        }
      };
    }

    utterance.aiServiceResponse = aiServiceResponse;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureAiServiceResponse.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureAiServiceResponse,
}
