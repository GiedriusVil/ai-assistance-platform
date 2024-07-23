/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';
import { transformContextForLogger } from '@ibm-aca/aca-data-transformer';

import { getDatasourceV1App } from '@ibm-aiap/aiap-app-datasource-provider';

import { getLambdaModulesDatasourceByContext } from '@ibm-aiap/aiap-lambda-modules-datasource-provider';

const getAppDatasourceByContext = (context: IContextV1) => {
  try {
    const RET_VAL = getDatasourceV1App();
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve app datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAppDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getDatasourceByContext = (context: IContextV1) => {
  try {
    const RET_VAL = getLambdaModulesDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve aca-lambda-modules-datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getDatasourceByContext.name, { error: error });
    throw ACA_ERROR;
  }
}

export {
  getAppDatasourceByContext,
  getDatasourceByContext,
}
