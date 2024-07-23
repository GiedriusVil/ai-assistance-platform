/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-transform-utterances-stream';

const { Transform } = require('stream');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const transformer = async (utterance) => {
  try {
    const AI_SERVICE_REQUEST = {
      type: 'WA',
      external: {
        workspaceId: utterance.skillId,
        input: lodash.isEmpty(utterance.message) ? {} : { text: utterance.message },
        context: utterance.context,
      }
    };
    const AI_SERVICE_RESPONSE = {
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

    // raw --> 
    // request

    utterance.aiServiceRequest = AI_SERVICE_REQUEST;
    utterance.aiServiceResponse = AI_SERVICE_RESPONSE;

    delete utterance.intents;
    delete utterance.entities;

    utterance.response = {
      text: utterance.response,
    };

    utterance._processed_2022_08_31 = true;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(transformer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getTransformStream = (params) => {
  const TRANSFORM_STREAM = new Transform({
    readableObjectMode: true,
    writableObjectMode: true, // Enables us to use object in chunk
    async transform(record, encoding, done) {
      try {
        await transformer(params.config, record);
        this.push(record);
        done();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error(getTransformStream.name, { ACA_ERROR });
        done(ACA_ERROR);
      }
    },
  });

  return TRANSFORM_STREAM;
};


module.exports = {
  getTransformStream,
};
