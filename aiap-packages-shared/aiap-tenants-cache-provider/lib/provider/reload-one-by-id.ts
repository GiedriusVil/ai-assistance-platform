/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-reload-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  reloadOne,
} from '@ibm-aiap/aiap-tenants-resources-loader';

export const reloadOneById = async (
  params: {
    id: any,
  },
) => {
  try {
    const ID = params?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      const ERROR_MESSAGE = 'Missing params.id required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE, { params });
    }
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, params);
    await reloadOne(TENANT);
    return TENANT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(reloadOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
