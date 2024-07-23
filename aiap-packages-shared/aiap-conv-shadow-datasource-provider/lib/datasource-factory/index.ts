/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-conv-shadow-datasource-provider-datasource-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  ConversationsShadowDatasourceMongoV1,
} from '../datasource-mongo';

import {
  IShadowDatasourceConfigurationConversationsV1,
} from '../types';


const _createDatasourceMongo = async (
  configuration: IShadowDatasourceConfigurationConversationsV1,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
    const RET_VAL = new ConversationsShadowDatasourceMongoV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_createDatasourceMongo.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createDatasource = async (
  configuration: IDatasourceConfigurationV1,
) => {
  try {
    // 2021-12-17 [LEGO] - We will have to thing about client type here!
    const RET_VAL = await _createDatasourceMongo(configuration as IShadowDatasourceConfigurationConversationsV1);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createDatasources = async (
  configurations: Array<IDatasourceConfigurationV1>,
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
    }
    const PROMISES = configurations.map((configuration) => {
      return createDatasource(configuration);
    });
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createDatasources.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createDatasource,
  createDatasources,
}
