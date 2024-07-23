/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2-collections-find-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const findMany = async (discoveryService, context, params) => {
  const PROJECT_ID = params?.projectId;
  const COLLECTION_IDS = params?.collectionIds;
  const NATURAL_LANGUAGE_QUERY = params?.naturalLanguageQuery;
  try {
    if (lodash.isEmpty(PROJECT_ID)) {
      const MESSAGE = `Missing params.projectId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (!lodash.isArray(COLLECTION_IDS)) {
      const MESSAGE = `Wrong parameter collectionIds type! [Expected Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(NATURAL_LANGUAGE_QUERY)) {
      const MESSAGE = `Missing params.naturalLanguageQuery parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const RET_VAL = await discoveryService.query(params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findMany,
};
