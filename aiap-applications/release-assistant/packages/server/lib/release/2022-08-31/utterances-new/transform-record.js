/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const transformRecord = (utterance) => {

  let raw;
  let request;
  let aiServiceRequest;
  let aiServiceResponse;
  let response;

  try {
    utterance._processed_2022_08_31 = true;

    raw = utterance?.raw;
    request = utterance?.request;

    aiServiceRequest = utterance?.aiServiceRequest;
    aiServiceResponse = utterance?.aiServiceResponse;
    response = utterance?.response;
    if (
      lodash.isEmpty(raw)
    ) {
      raw = {
        message: {
          text: utterance?.message
        }
      };
    }
    if (
      lodash.isEmpty(request)
    ) {
      request = {
        message: {
          text: utterance?.message,
        }
      };
    }
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
    if (
      lodash.isEmpty(aiServiceResponse)
    ) {
      aiServiceResponse = {
        type: 'WA',
        external: {
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
      };
    }
    if (
      !lodash.isObject(response)
    ) {
      response = {
        text: utterance?.response,
      };
    }

    utterance.raw = raw;
    utterance.request = request;
    utterance.aiServiceRequest = aiServiceRequest;
    utterance.aiServiceResponse = aiServiceResponse;
    utterance.response = response;

    delete utterance.intents;
    delete utterance.entities;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(transformRecord.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transformRecord,
}
