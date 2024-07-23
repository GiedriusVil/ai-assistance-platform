/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2-projects-update-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const updateOne = async (discoveryService, context, params) => {
  const PROJECT_ID = params.projectId;
  const COLLECTION_ID = params?.collectionId;
  const NAME = params?.name;
  const DESCRIPTION = params?.description;
  try {
    if (lodash.isEmpty(PROJECT_ID)) {
      const MESSAGE = `Missing params.projectId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(COLLECTION_ID)) {
      const MESSAGE = `Missing params.collectionId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(NAME)) {
      const MESSAGE = `Missing params.name parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(DESCRIPTION)) {
      const MESSAGE = `Missing params.name parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const RET_VAL = await discoveryService.updateCollection(params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(updateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  updateOne,
};
