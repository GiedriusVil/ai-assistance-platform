/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  transformContextForLogger,
} from '@ibm-aca/aca-data-transformer';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  getEngagementsDatasourceByContext as _getEngagementsDatasourceByContext
} from '@ibm-aiap/aiap-engagements-datasource-provider';

export const getAppDatasourceByContext = (
  context: IContextV1
) => {
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

export const getEngagementsDatasourceByContext = (
  context: IContextV1
) => {
  try {
    const RET_VAL = _getEngagementsDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve engagements datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getEngagementsDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
