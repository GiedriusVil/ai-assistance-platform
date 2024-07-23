/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ensureRaw } = require('./ensure-raw');
const { ensureRequest } = require('./ensure-request');
const { ensureAiService } = require('./ensure-ai-service');
const { ensureAiServiceRequest } = require('./ensure-ai-service-request');
const { ensureAiServiceResponse } = require('./ensure-ai-service-response');
const { ensureResponse } = require('./ensure-response');

const transformRecord = (params) => {
  let utterance;

  try {
    utterance = params?.utterance;
    utterance._processed_2022_08_31 = true;

    ensureRaw(params);
    ensureRequest(params);
    ensureAiService(params);
    ensureAiServiceRequest(params);
    ensureAiServiceResponse(params);
    ensureResponse(params);

    if (
      !lodash.isEmpty(utterance?.context) &&
      lodash.isEmpty(utterance?.context?.metadata)
    ) {
      utterance.context.metadata = {};
      utterance.context.metadata.userId = utterance?.context?.private?.userProfile?.id || utterance?.context?.private?.userProfile?.userId;
    } else {
      utterance.context.metadata.userId = utterance?.context?.private?.userProfile?.id || utterance?.context?.private?.userProfile?.userId;
    }

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
