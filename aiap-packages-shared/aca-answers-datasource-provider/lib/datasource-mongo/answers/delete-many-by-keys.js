/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-datasource-mongo-answers-delete-many-by-keys';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const deleteManyByKeys = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.answerStores;

  const PARAMS_ANSWER_STORE_ID = params?.answerStoreId;
  const PARAMS_ANSWER_KEYS = params?.keys;

  let filter;
  let pullCondition;
  let pullOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_ANSWER_KEYS)
    ) {
      const MESSAGE = `Missing required params.keys parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(PARAMS_ANSWER_KEYS)
    ) {
      const MESSAGE = `Wrong type params.keys parameter! [Expected - Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(PARAMS_ANSWER_STORE_ID) &&
      !validator.isAlphanumeric(PARAMS_ANSWER_STORE_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Wrong type params.answerStoreId parameter! [Expected - MongoId]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: {
        $eq: PARAMS_ANSWER_STORE_ID
      }
    };

    pullCondition = {
      $pull: {
        answers: {
          key: {
            $in: PARAMS_ANSWER_KEYS
          }
        }
      }
    };

    pullOptions = {
      multi: true
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: pullCondition,
          options: pullOptions,
        });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(deleteManyByKeys.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByKeys,
}
