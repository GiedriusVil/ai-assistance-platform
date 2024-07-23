/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2022-11-16-utterances-construct-operation-buckets-messages`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { processMessage } = require('./transform-record/process-message');

const constructReplaceOneOperationsMessages = (params) => {

  const RET_VAL = [];
  try {

    messagesWithUtterances = params?.messagesWithUtterances;
    if (
      !lodash.isEmpty(messagesWithUtterances) &&
      lodash.isArray(messagesWithUtterances)
    ) {
      for (let message of messagesWithUtterances) {
        processMessage(message);
        const OPERATION = {
          replaceOne: {
            filter: {
              _id: message._id,
            },
            replacement: message,
          }
        };
        RET_VAL.push(OPERATION);
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(constructReplaceOneOperationsMessages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  constructReplaceOneOperationsMessages,
}
