/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-reload-one-by-external-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  reloadOne,
} from '@ibm-aiap/aiap-tenants-resources-loader';

export const reloadOneByExternalId = async (
  params: {
    externalId: any,
  },
) => {
  let externalId;
  try {
    externalId = params?.externalId;
    if (
      lodash.isEmpty(externalId)
    ) {
      const ERROR_MESSAGE = 'Missing params.externalId required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE, { params });
    }
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneByExternalId({}, params);
    console.log(MODULE_ID, { TENANT });
    await reloadOne(TENANT);
    return TENANT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { externalId })
    logger.error(reloadOneByExternalId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
