/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-datasource-mongo-modules-audits-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.rulesAudits;

  let value;
  let valueId;
  let id;

  let filter;
  let update;
  let updateOptions;
  try {
    value = params?.value;
    valueId = value?.id;
    id = lodash.isEmpty(valueId) ? uuidv4() : valueId;

    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(id) &&
      !validator.isAlphanumeric(id, 'en-US', { ignore: '_-' })
    ) {
      const MESSAGE = `Invalid id variable!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = { _id: id }
    update = { $set: value };
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

    const RET_VAL = await findOneById(datasource, context, { id });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, update });
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
