
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-sub-classes-delete-many-by-catalog-id';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const deleteManyByCatalogId = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  const PARAMS_CATALOG_ID = params?.catalogId;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_CATALOG_ID)
    ) {
      const MESSAGE = `Missing required params.catalogId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      catalogId: {
        $eq: PARAMS_CATALOG_ID
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: datasource._collections.subClasses,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });
    const RET_VAL = {
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    LOGGER.error(deleteManyByCatalogId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByCatalogId,
}
