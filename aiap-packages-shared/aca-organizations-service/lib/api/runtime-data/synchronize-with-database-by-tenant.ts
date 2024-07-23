/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getDatasourceByContext } from '../datasource.utils';

const synchronizeWithDatabaseByTenant = async (context, params) => {
  let configPolicyManagerOrganizationsAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configPolicyManagerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configPolicyManagerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configPolicyManagerOrganizationsAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/organizations`;
    fsExtra.ensureDirSync(configPolicyManagerOrganizationsAbsolutePath);

    const ORG_FILES = fsExtra.readdirSync(configPolicyManagerOrganizationsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(ORG_FILES) &&
      lodash.isArray(ORG_FILES)
    ) {
      for (const ORG_FILE of ORG_FILES) {
        if (
          !lodash.isEmpty(ORG_FILE) &&
          lodash.isString(ORG_FILE) &&
          ORG_FILE.endsWith('.json')
        ) {
          const ORGANIZATION = fsExtra.readJsonSync(`${configPolicyManagerOrganizationsAbsolutePath}/${ORG_FILE}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.organizations.saveOne(context, { organization: ORGANIZATION })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseByTenant,
}
