
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-utterances-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const _sanitizeBeforeSave = (message) => {
  delete message.id;
}

const saveMany = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let values;
  const OPERATIONS = [];

  try {
    values = params?.values;
    if (
      !lodash.isArray(values)
    ) {
      const MESSAGE = 'Wrong type of params.values attribute! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (!lodash.isEmpty(values)) {
      for (let value of values) {
        const FILTER = {
          _id: value?.id
        };
        _sanitizeBeforeSave(value);
        const UPDATE_CONDITION = {
          $set: value
        };
        const UPDATE_OPTIONS = {
          upsert: true,
          ...params?.options,
        };

        const OPERATION = {
          updateOne: {
            filter: FILTER,
            update: UPDATE_CONDITION,
            UPDATE_OPTIONS,
          }
        };
        OPERATIONS.push(OPERATION);
      }

      const BULK_WRITE_OPTIONS = {
        ordered: false,
        ...params?.options,
      };

      const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
      const DB = await ACA_MONGO_CLIENT.getDB();

      const RET_VAL = await DB.collection(COLLECTION).bulkWrite(OPERATIONS, BULK_WRITE_OPTIONS);
      return RET_VAL;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(saveMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveMany,
};
