/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2022-11-16-utterances-create-ticket-construct-operation-buckets`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { transformRecord } = require('./transform-record/index');

const constructReplaceOneOperations = (params) => {

  const RET_VAL = [];
  try {

    utterances = params?.utterances;
    if (
      !lodash.isEmpty(utterances) &&
      lodash.isArray(utterances)
    ) {
      for (let utterance of utterances) {
        transformRecord(utterance);
        
        const OPERATION = {
          replaceOne: {
            filter: {
              _id: utterance._id,
            },
            replacement: utterance,
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
