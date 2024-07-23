/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2022-08-31-utterances-construct-operation-buckets`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { transformRecord } = require('./transform-record/index');

const constructReplaceOneOperations = (params) => {

  const RET_VAL = [];
  try {

    conversations = params?.conversations;
    if (
      !lodash.isEmpty(conversations) &&
      lodash.isArray(conversations)
    ) {
      for (let conversation of conversations) {
        transformRecord(conversation);
        
        const OPERATION = {
          replaceOne: {
            filter: {
              _id: conversation._id,
            },
            replacement: conversation,
          }
        };
        RET_VAL.push(OPERATION);
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(constructReplaceOneOperations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  constructReplaceOneOperations,
}
