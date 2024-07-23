/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2-projects-delete-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const deleteOne = async (discoveryService, context, params) => {
  const PROJECT_ID = params?.projectId;
  try {
    if (lodash.isEmpty(PROJECT_ID)) {
      const MESSAGE = `Missing params.projectId parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    
    const RET_VAL = await discoveryService.deleteProject(params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteOne,
};
