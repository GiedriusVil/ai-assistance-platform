/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider-reload-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindTenantsByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  reloadOne,
} from '@ibm-aiap/aiap-tenants-resources-loader';

export const reloadManyByQuery = async (
  context: IContextV1,
  params: IParamsV1FindTenantsByQuery,
) => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const FIND_RESULT = await DATASOURCE.tenants.findManyByQuery(context, params);
    const TENANTS = FIND_RESULT?.items;
    if (
      lodash.isArray(TENANTS)
    ) {
      const PROMISES = TENANTS.map((tenant) => {
        return reloadOne(tenant);
      });
      await Promise.all(PROMISES);
    }
    return TENANTS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(reloadManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
