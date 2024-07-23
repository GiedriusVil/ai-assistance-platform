/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider-watson-discovery-service-v2-projects-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const createOne = async (discoveryService, context, params) => {
  const NAME = params?.name;
  const TYPE = params.type;
  try {
    if (lodash.isEmpty(NAME)) {
      const MESSAGE = `Missing params.name parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(TYPE)) {
      const MESSAGE = `Missing params.type parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    
    const RET_VAL = await discoveryService.createProject(params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  createOne,
};
