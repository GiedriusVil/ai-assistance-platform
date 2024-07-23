/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-v2-datasource-mongo-rules-changes-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_RECORD = params?.record;
  try {
    if (lodash.isEmpty(PARAMS_RECORD)) {
      const MESSAGE = `Missing required params.record parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__insertOne(context,
        {
          collection: datasource._collections.rulesChangesV2,
          doc: PARAMS_RECORD,
        });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_RECORD });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
