/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-request';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureRequest = (params) => {
  let request;
  let utterance;
  try {
    utterance = params?.utterance;
    request = utterance?.request;
    if (
      lodash.isEmpty(request)
    ) {
      request = {
        message: {
          text: utterance?.message,
        }
      };
    }
    utterance.request = request;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureRequest.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureRequest,
}
