/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-messages-update-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { addSigle$SetAttributeToPipeline } = require('@ibm-aiap/aiap-utils-mongo');

const updateOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.messages;

  let filter;
  const _ID = ramda.path(['id'], params);
  try {
    if (
      lodash.isEmpty(_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    filter = {
      _id: _ID
    };

    const STATUS = ramda.path(['status'], params);
    const MESSAGE = ramda.path(['message'], params);

    const UPDATE_PIPELINE = [];
    addSigle$SetAttributeToPipeline(UPDATE_PIPELINE, 'status', STATUS);
    addSigle$SetAttributeToPipeline(UPDATE_PIPELINE, 'message', MESSAGE);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: UPDATE_PIPELINE
        });

    const RET_VAL = {
      modified: ramda.pathOr(0, ['modifiedCount'], RESPONSE)
    }
    logger.info('RET_VAL', { RET_VAL });
    return RET_VAL;
  }
  catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(updateOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  updateOneById
}
