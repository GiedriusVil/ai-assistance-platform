/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watsonx-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';
import { calcHash } from '@ibm-aiap/aiap-utils-hash';

import { IWatsonxV1ConfigurationExternal } from './lib/watsonx-v1/types';
import { AiapWatsonxV1 } from './lib/watsonx-v1';

const WATSONX_INSTANCES = {};

const getInstanceId = (
  external: IWatsonxV1ConfigurationExternal
) => {
  const RET_VAL = calcHash(external);
  return RET_VAL;
};

const initWatsonx = (
  external: IWatsonxV1ConfigurationExternal
) => {
  const INSTANCE_ID = getInstanceId(external);
  const RET_VAL = new AiapWatsonxV1(external);
  WATSONX_INSTANCES[INSTANCE_ID] = RET_VAL;
  logger.info(`INITIALIZED INSTANCE_ID: ${INSTANCE_ID}`, { external });
  return RET_VAL;
};

const getWatsonxByServiceExternal = (
  external: IWatsonxV1ConfigurationExternal
) => {
  try {
    const INSTANCE_ID = getInstanceId(external);
    let retVal = WATSONX_INSTANCES[INSTANCE_ID];
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = initWatsonx(external);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getWatsonxByServiceExternal.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getWatsonxByService = (
  service: {
    id?: string,
    external?: IWatsonxV1ConfigurationExternal
  }
) => {
  const SERVICE_ID = service?.id;
  const SERVICE_EXTERNAL = service?.external;
  try {
    if (
      lodash.isEmpty(service)
    ) {
      const MESSAGE = `Missing required service parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(SERVICE_EXTERNAL)
    ) {
      const MESSAGE = `Missing required service.external parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getWatsonxByServiceExternal(SERVICE_EXTERNAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { SERVICE_ID, SERVICE_EXTERNAL });
    logger.error(getWatsonxByService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getInstanceId,
  getWatsonxByService,
};
