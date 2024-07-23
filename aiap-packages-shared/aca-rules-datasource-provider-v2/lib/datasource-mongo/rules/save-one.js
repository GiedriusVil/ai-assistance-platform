/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-v2-datasource-mongo-rules-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.rulesV2;
  let filter;
  let update;
  let updateOptions;

  let ruleV2;
  let ruleId;
  let id;
  try {
    ruleV2 = params?.ruleV2;
    if (
      lodash.isEmpty(ruleV2)
    ) {
      const MESSAGE = `Missing required params.ruleV2 parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    ruleId = ruleV2.id;
    id = lodash.isEmpty(ruleId) ? uuidv4() : ruleId;
    delete ruleV2.id;
    if (
      !validator.isMongoId(id) &&
      !validator.isAlphanumeric(id, 'en-US', { ignore: '_-' })
    ) {
      const MESSAGE = `Invalid id variable!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: {
        $eq: id
      }
    };
    update = { $set: ruleV2 };
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
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
