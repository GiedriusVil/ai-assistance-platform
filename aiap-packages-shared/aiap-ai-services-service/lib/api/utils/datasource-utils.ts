/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  transformContextForLogger,
} from '@ibm-aca/aca-data-transformer';

import {
  getAiServicesDatasourceByContext as _getAiServicesDatasourceByContext,
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  getAcaConversationsDatasourceByContext as _getAcaConversationsDatasourceByContext
} from '@ibm-aca/aca-conversations-datasource-provider';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const getAiServicesDatasourceByContext = (
  context: IContextV1,
) => {
  try {
    const RET_VAL = _getAiServicesDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve ai-services datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAiServicesDatasourceByContext.name, { error: error });
    throw ACA_ERROR;
  }
}

export const getAcaConversationsDatasourceByContext = (
  context: IContextV1,
) => {
  try {
    const RET_VAL = _getAcaConversationsDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve aca-conversations datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAiServicesDatasourceByContext.name, { error: error });
    throw ACA_ERROR;
  }
}

export const getAppDatasource = () => {
  try {
    const RET_VAL = getDatasourceV1App();
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve aca-app datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAppDatasource.name, { error: error });
    throw ACA_ERROR;
  }
}

