
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-classes-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;

const { deleteManyByClassId } = require('../sub-classes');

const _deleteSubClasses = async (datasource, context, params) => {
  const PARAMS_IDS = params?.ids;
  try {
    const PROMISES = [];
    if (
      lodash.isArray(PARAMS_IDS) &&
      !lodash.isEmpty(PARAMS_IDS)
    ) {
      for (let classId of PARAMS_IDS) {
        if (
          !lodash.isEmpty(classId)
        ) {
          PROMISES.push(deleteManyByClassId(datasource, context, { classId }));
        }
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { PARAMS_IDS });
    logger.error(_deleteSubClasses.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByIds = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.classes;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };

  const PARAMS_IDS = params?.ids;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const MESSAGE = `Missing required params.ids parater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      _id: {
        $in: PARAMS_IDS
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__deleteMany(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter
      });
    await _deleteSubClasses(datasource, context, params);
    const RET_VAL = {
      ids: PARAMS_IDS,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIds,
}
