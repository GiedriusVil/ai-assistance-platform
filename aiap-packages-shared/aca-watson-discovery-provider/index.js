/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { AcaWatsonDiscoveryServiceV2 } = require('./lib/watson-discovery-service-v2');

const DISCOVERY_SERVICES = {};

const _instanceId = (external) => {
  const AUTH_TYPE = external?.authType;
  const VERSION = external?.version;
  const URL = external?.url;
  const RET_VAL = `${AUTH_TYPE}:${VERSION}:${URL}`;
  return RET_VAL;
};

const _initWatsonDiscoveryService = (external) => {
  const INSTANCE_ID = _instanceId(external);
  const RET_VAL = new AcaWatsonDiscoveryServiceV2(external);
  DISCOVERY_SERVICES[INSTANCE_ID] = RET_VAL;
  logger.info(`INITIALIZED INSTANCE_ID: ${INSTANCE_ID}`, { external });
  return RET_VAL;
};

const getWatsonDiscoveryServiceByAiSearchAndAnalysisServiceExternal = (external) => {
  try {
    const INSTANCE_ID = _instanceId(external);
    let retVal = DISCOVERY_SERVICES[INSTANCE_ID];
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = _initWatsonDiscoveryService(external);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getWatsonDiscoveryServiceByAiSearchAndAnalysisServiceExternal.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getWatsonDiscoveryServiceByAiSearchAndAnalysisService = (aiSearchAndAnalysisService) => {
  const AI_TRANSLATION_SERVICE_ID = aiSearchAndAnalysisService?.id;
  const AI_TRANSLATION_SERVICE_EXTERNAL = aiSearchAndAnalysisService?.external;
  try {
    if (
      lodash.isEmpty(aiSearchAndAnalysisService)
    ) {
      const MESSAGE = `Missing required aiSearchAndAnalysisService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_EXTERNAL)
    ) {
      const MESSAGE = `Missing required aiSearchAndAnalysisService.external parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getWatsonDiscoveryServiceByAiSearchAndAnalysisServiceExternal(AI_TRANSLATION_SERVICE_EXTERNAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { AI_TRANSLATION_SERVICE_ID });
    logger.error(getWatsonDiscoveryServiceByAiSearchAndAnalysisService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getWatsonDiscoveryServiceByAiSearchAndAnalysisService,
};
