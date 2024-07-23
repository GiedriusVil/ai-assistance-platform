/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-organizations-find-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, formatIntoAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const validator = require('validator');

const findOneByExternalId = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_EXTERNAL_ID = params?.externalId;
  const COLLECTION_OPTIONS = {
    readPreference: ReadPreference.SECONDARY_PREFERRED
  }
  let filter;
  try {
    if (lodash.isEmpty(PARAMS_EXTERNAL_ID)) {
      const MESSAGE = 'Missing required params.externalId attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isUUID(PARAMS_EXTERNAL_ID) &&
      !validator.isAlphanumeric(PARAMS_EXTERNAL_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Parameter external.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      'external.id': {
        $eq: PARAMS_EXTERNAL_ID
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.organizations,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByExternalId
}
