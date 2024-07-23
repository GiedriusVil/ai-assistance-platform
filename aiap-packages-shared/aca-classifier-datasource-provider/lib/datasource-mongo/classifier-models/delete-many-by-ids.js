
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-datasource-mongo-models-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const _deleteClassifierModels = async (datasource, context, params) => {
  const IDS = ramda.path(['ids'], params);
  const PROMISES = [];
  if (
    lodash.isArray(IDS) &&
    !lodash.isEmpty(IDS)
  ) {
    for (let modelId of IDS) {
      if (
        !validator.isMongoId(modelId) &&
        !validator.isAlphanumeric(modelId, 'en-US', { ignore: '$_-' })
      ) {
        const ERROR_MESSAGE = 'Invalid params.id attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      PROMISES.push(_deleteClassifierModels(datasource, context, { modelId }));
    }
  }
  await Promise.all(PROMISES);
}

const deleteManyByIds = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.models;

  const IDS = ramda.path(['ids'], params);

  let filter;
  try {
    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const COLLECTION_OPTIONS = {
      readPreference: ReadPreference.PRIMARY
    };
    filter = {
      _id: {
        $in: IDS
      }
    }

    await _deleteClassifierModels(datasource, context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, IDS, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIds
}
