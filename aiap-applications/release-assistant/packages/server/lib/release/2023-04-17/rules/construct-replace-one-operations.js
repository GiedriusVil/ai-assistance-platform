/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2023-04-17-rules-construct-replace-one-operations`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const constructReplaceOneOperations = (rules) => {
  const RET_VAL = [];
  try {
    for (const RULE of rules) {
      const OPERATION = {
        replaceOne: {
          filter: {
            _id: {
              $eq: RULE._id,
            }
          },
          replacement: RULE,
        }
      };
      RET_VAL.push(OPERATION);
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructReplaceOneOperations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


module.exports = {
  constructReplaceOneOperations,
};
