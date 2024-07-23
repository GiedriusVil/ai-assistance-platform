/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AiServicesDatasourceMongoV1,
} from '../datasource-mongo';


const _createAiServicesDatasourceMongoV1 = async (
  configuration: any,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new AiServicesDatasourceMongoV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_createAiServicesDatasourceMongoV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAiServicesDatasource = async (
  configuration: any,
) => {
  try {
    // 2021-12-17 [LEGO] - We will have to thing about client type here!
    const RET_VAL = await _createAiServicesDatasourceMongoV1(configuration)
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAiServicesDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAiServicesDatasources = async (
  configurations: any,
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createAiServicesDatasource(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAiServicesDatasources.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createAiServicesDatasource,
  createAiServicesDatasources,
}
