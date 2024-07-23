/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-mongo-messages-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getMessageImportCollectionName } = require('../../utils');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const IS_IMPORT = ramda.pathOr(false, ['isImport'], params);
  const COLLECTION = IS_IMPORT ? getMessageImportCollectionName(context) : datasource._collections.rulesMessages;
  let message;
  let messageId;
  let filter;
  let update;
  let updateOptions;
  try {
    message = params?.message;
    if (
      lodash.isEmpty(message)
    ) {
      const MESSAGE = 'Missing required params.message attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    messageId = ramda.pathOr(uuidv4(), ['id'], message);
    if (
      !validator.isMongoId(messageId) &&
      !validator.isAlphanumeric(messageId, 'en-US', { ignore: '_-' })
    ) {
      const VALIDATION_MESSAGE = 'Mandatory parameter id invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, VALIDATION_MESSAGE);
    }
    filter = {
      _id: {
        $eq: messageId
      }
    };
    update = { $set: message };
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

    const RET_VAL = await findOneById(datasource, context, { id: messageId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
