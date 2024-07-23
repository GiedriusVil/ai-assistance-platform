/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-datasource-mongo-oauth2-tokens-refresh-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { uuidv4 } = require('@ibm-aca/aca-wrapper-uuid');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.oauth2TokensRefresh;

  let token;
  let tokenId;

  let filter;
  let update;
  let updateOptions;
  try {
    token = params?.token;
    if (
      lodash.isEmpty(token)
    ) {
      const MESSAGE = `Missing required params.token parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    tokenId = ramda.pathOr(uuidv4(), ['id'], token);
    if (
      !validator.isMongoId(tokenId) &&
      !validator.isAlphanumeric(tokenId, 'en-US', { ignore: '_-' })
    ) {
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Invalid params.token.id attribute!');
    }
    filter = { _id: tokenId }
    update = { $set: token };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: update,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: tokenId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
