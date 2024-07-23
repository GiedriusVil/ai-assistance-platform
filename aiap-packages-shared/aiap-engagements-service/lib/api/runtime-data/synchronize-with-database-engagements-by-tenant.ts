/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-runtime-data-service-synchronize-with-database-engagements-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} from '@ibm-aca/aca-utils-codec';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

export const synchronizeWithDatabaseEngagementsByTenant = async (
  context: IContextV1,
  params: {
    configTenantCustomizerAbsolutePath: any,
    tenantId: any
  }
) => {
  let configTenantCustomizerEngagementsAbsolutePath;
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
    configTenantCustomizerEngagementsAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/engagements`;
    fsExtra.ensureDirSync(configTenantCustomizerEngagementsAbsolutePath);

    const ENGAGEMENT_FILES = fsExtra.readdirSync(configTenantCustomizerEngagementsAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(ENGAGEMENT_FILES) &&
      lodash.isArray(ENGAGEMENT_FILES)
    ) {
      for (const ENGAGEMENT_FILE of ENGAGEMENT_FILES) {
        if (
          !lodash.isEmpty(ENGAGEMENT_FILE) &&
          lodash.isString(ENGAGEMENT_FILE) &&
          ENGAGEMENT_FILE.endsWith('.json')
        ) {
          const valueCssFile = ENGAGEMENT_FILE.replace('.json', '.css');

          const VALUE = fsExtra.readJsonSync(`${configTenantCustomizerEngagementsAbsolutePath}/${ENGAGEMENT_FILE}`);
          const VALUE_STYLES_VALUE_CSS = fsExtra.readFileSync(`${configTenantCustomizerEngagementsAbsolutePath}/${valueCssFile}`).toString();

          if (
            lodash.isEmpty(VALUE?.styles)
          ) {
            VALUE.styles = {};
          }
          VALUE.styles.value = encode({
            input: VALUE_STYLES_VALUE_CSS,
            type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
          });

          const DATASOURCE = getEngagementsDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.engagements.saveOne(context, { value: VALUE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseEngagementsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
