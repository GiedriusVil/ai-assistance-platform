/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-runtime-data-service-synchronize-with-database-modules-by-tenant';
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

import { 
  fsExtra 
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} from '@ibm-aca/aca-utils-codec';

import { 
  getDatasourceByContext 
} from '../datasource.utils';

const synchronizeWithDatabaseModulesByTenant = async (context: IContextV1, params) => {
  let configTenantCustomizerModulesAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configTenantCustomizerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configTenantCustomizerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configTenantCustomizerModulesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/lambda-modules`;
    fsExtra.ensureDirSync(configTenantCustomizerModulesAbsolutePath);

    const ENTITIES_FILES = fsExtra.readdirSync(configTenantCustomizerModulesAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(ENTITIES_FILES) &&
      lodash.isArray(ENTITIES_FILES)
    ) {
      for (let valueJsonFile of ENTITIES_FILES) {
        if (
          !lodash.isEmpty(valueJsonFile) &&
          lodash.isString(valueJsonFile) &&
          valueJsonFile.endsWith('.json')
        ) {
          let valueJsFile = valueJsonFile.replace('.json', '.js');
          const VALUE = fsExtra.readJsonSync(`${configTenantCustomizerModulesAbsolutePath}/${valueJsonFile}`);
          const VALUE_CODE_JS = fsExtra.readFileSync(`${configTenantCustomizerModulesAbsolutePath}/${valueJsFile}`).toString();

          VALUE.code = encode({
            input: VALUE_CODE_JS,
            type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
          });

          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.modules.saveOne(context, { value: VALUE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseModulesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseModulesByTenant,
}
