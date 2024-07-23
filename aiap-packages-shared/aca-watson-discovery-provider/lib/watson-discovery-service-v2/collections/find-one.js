/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2-collections-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const findOne = async (discoveryService, context, params) => {
  const PROJECT_ID = params?.projectId;
  const COLLECTION_ID = params?.collectionId;
  try {
    if (lodash.isEmpty(PROJECT_ID)) {
      const MESSAGE = `Missing params.projectId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(COLLECTION_ID)) {
      const MESSAGE = `Missing params.collectionId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const RET_VAL = await discoveryService.getCollection(params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findOne,
};
