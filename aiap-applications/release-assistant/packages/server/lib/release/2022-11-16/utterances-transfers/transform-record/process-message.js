/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const processMessage = (message) => {

  try {
    message._processed_2022_11_16 = true;
    const MESSAGE_UTTERANCE = message?.utterance;
    if (
      !lodash.isEmpty(MESSAGE_UTTERANCE)
    ) {
      delete message.utterance
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(processMessage.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  processMessage,
}
