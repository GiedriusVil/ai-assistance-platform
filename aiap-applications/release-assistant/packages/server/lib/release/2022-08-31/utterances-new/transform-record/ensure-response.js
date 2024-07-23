/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-response';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureResponse = (params) => {
  let response;
  let utterance;
  try {
    utterance = params?.utterance;
    response = utterance?.response;

    if (
      !lodash.isObject(response)
    ) {
      response = {
        text: utterance?.response,
      };
    }

    utterance.response = response;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureResponse.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureResponse,
}
