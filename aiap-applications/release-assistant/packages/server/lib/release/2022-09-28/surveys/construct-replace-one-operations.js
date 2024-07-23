/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-09-31-surveys-construct-operation-buckets';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { transformRecord } = require('./transform-record');

const constructReplaceOneOperations = async (configuration, db, surveys) => {
  const RET_VAL = [];
  try {
    if (
      !lodash.isEmpty(surveys) &&
      lodash.isArray(surveys)
    ) {
      for (const survey of surveys) {
        await transformRecord(configuration, db, survey);
        const OPERATION = {
          replaceOne: {
            filter: {
              _id: survey._id,
            },
            replacement: survey,
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
