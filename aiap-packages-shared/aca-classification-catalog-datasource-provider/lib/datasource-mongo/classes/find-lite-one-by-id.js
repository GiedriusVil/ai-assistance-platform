/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-classes-find-lite-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { transformToLiteClassificationCatalogCategory } = require('@ibm-aca/aca-data-transformer');

const findLiteOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.classes;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  const PARAMS_ID = params?.id;
  const PARAMS_LANGUAGE = params?.language;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(PARAMS_LANGUAGE)
    ) {
      const MESSAGE = `Missing required params.language parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: {
        $eq: PARAMS_ID
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const OBJECTS = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const OBJECT = ramda.path([0], OBJECTS);
    sanitizeIdAttribute(OBJECT);
    const RET_VAL = transformToLiteClassificationCatalogCategory(OBJECT, PARAMS_LANGUAGE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(findLiteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findLiteOneById
}
