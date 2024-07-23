/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2023-03-30-doc-validations-construct-replace-one-operations`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const constructReplaceOneOperations = (audits) => {
  const RET_VAL = [];
  try {
    for (const AUDIT of audits) {
      const OPERATION = {
        replaceOne: {
          filter: {
            _id: {
              $eq: AUDIT._id,
            }
          },
          replacement: AUDIT,
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
