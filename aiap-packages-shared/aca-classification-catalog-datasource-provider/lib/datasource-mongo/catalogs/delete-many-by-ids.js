
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-catalogs-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, throwAcaError, appendDataToError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const { deleteManyByCatalogId: deleteSubClassesByCatalogId } = require('../sub-classes');
const { deleteManyByCatalogId: deleteClassesByCatalogId } = require('../classes');
const { deleteManyByCatalogId: deleteFamiliesByCatalogId } = require('../families');
const { deleteManyByCatalogId: deleteSegmentsByCatalogId } = require('../segments');

const _deleteCatalogCategories = async (datasource, context, params) => {
  const PARAMS_CATALOG_ID = params?.catalogId;
  try {
    if (
      !lodash.isEmpty(PARAMS_CATALOG_ID)
    ) {
      const PARAMS = { catalogId: PARAMS_CATALOG_ID };
      await deleteSubClassesByCatalogId(datasource, context, PARAMS);
      await deleteClassesByCatalogId(datasource, context, PARAMS);
      await deleteFamiliesByCatalogId(datasource, context, PARAMS);
      await deleteSegmentsByCatalogId(datasource, context, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PARAMS_CATALOG_ID });
    logger.error(_deleteCatalogCategories.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _deleteCatalogsCategories = async (datasource, context, params) => {
  const PARAMS_IDS = params?.ids;
  try {
    const PROMISES = [];
    if (
      lodash.isArray(PARAMS_IDS) &&
      !lodash.isEmpty(PARAMS_IDS)
    ) {
      for (let catalogId of PARAMS_IDS) {
        if (
          !validator.isMongoId(catalogId) &&
          !validator.isAlphanumeric(catalogId, 'en-US', { ignore: '$_-' })
        ) {
          const ERROR_MESSAGE = 'Invalid params.id attribute!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
        }
        PROMISES.push(_deleteCatalogCategories(datasource, context, { catalogId }));
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PARAMS_IDS });
    logger.error(_deleteCatalogCategories.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByIds = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  const PARAMS_IDS = params?.ids;
  let filter;

  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: {
        $in: PARAMS_IDS
      }
    };
    await _deleteCatalogsCategories(datasource, context, params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: datasource._collections.catalogs,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });

    const RET_VAL = {
      ids: PARAMS_IDS,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_IDS, COLLECTION_OPTIONS, filter });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIds,
}
