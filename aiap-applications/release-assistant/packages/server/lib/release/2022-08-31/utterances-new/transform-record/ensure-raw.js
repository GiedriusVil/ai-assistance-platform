/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-raw';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureRaw = (params) => {
  let raw;
  let utterance;
  try {
    utterance = params?.utterance;
    raw = utterance?.raw;
    if (
      lodash.isEmpty(raw)
    ) {
      raw = {
        message: {
          text: utterance?.message
        }
      };
    }
    utterance.raw = raw;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureRaw.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureRaw,
}
