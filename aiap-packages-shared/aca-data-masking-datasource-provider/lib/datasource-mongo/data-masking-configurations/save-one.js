/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-data-masking-datasource-mongo-data-masking-configurations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { findOneByKey } = require('./find-one-by-key');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.dataMaskingConfigurations;
  let maskingConfig;
  let filter;
  let update;
  let updateOptions;
  let configKey;
  try {
    maskingConfig = params?.maskingConfig;
    if (
      lodash.isEmpty(maskingConfig)
    ) {
      const MESSAGE = `Missing required params.maskingConfig parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    configKey = maskingConfig.key;
    delete maskingConfig.key;
    if (
      lodash.isEmpty(maskingConfig)
    ) {
      const MESSAGE = `Missing required params.maskingConfig.key parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !lodash.isString(configKey)
    ) {
      const MESSAGE = `Wrong type params.maskingConfig.key parameter! [Expected - String]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    filter = {
      _id: {
        $eq: configKey
      }
    };
    update = { $set: maskingConfig };
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

    const RET_VAL = await findOneByKey(datasource, context, { key: configKey });
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
