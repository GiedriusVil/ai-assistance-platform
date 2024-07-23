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
  formatIntoAcaError 
} from '@ibm-aca/aca-utils-errors';

import {
  AiTranslationServicesDatasourceMongoV1
} from '../datasource-mongo';

import {
  IDatasourceConfigurationAITranslationServicesV1
} from '../types/configuration';

const _createMongoDatasource = async (
  configuration: IDatasourceConfigurationAITranslationServicesV1
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new AiTranslationServicesDatasourceMongoV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_createMongoDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAiTranslationServicesDatasource = async (configuration: any) => {
  try {
    // 2021-12-17 [LEGO] - We will have to thing about client type here!
    const RET_VAL = await _createMongoDatasource(configuration)
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAiTranslationServicesDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createAiTranslationServicesDatasources = async (
  configurations: Array<any>
  ) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createAiTranslationServicesDatasource(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAiTranslationServicesDatasources.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createAiTranslationServicesDatasource,
  createAiTranslationServicesDatasources,
}
