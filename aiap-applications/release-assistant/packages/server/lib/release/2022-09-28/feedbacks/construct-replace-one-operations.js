/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-feedbacks-construct-operation-buckets';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { transformRecord } = require('./transform-record');

const constructReplaceOneOperations = async (configuration, db, feedbacks) => {
  const RET_VAL = [];
  try {
    if (
      !lodash.isEmpty(feedbacks) &&
      lodash.isArray(feedbacks)
    ) {
      for (const feedback of feedbacks) {
        await transformRecord(configuration, db, feedback);
        const OPERATION = {
          replaceOne: {
            filter: {
              _id: feedback._id,
            },
            replacement: feedback,
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
