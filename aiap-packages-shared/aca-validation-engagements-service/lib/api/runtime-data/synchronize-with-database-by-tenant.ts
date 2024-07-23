/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getDatasourceByContext } from '../datasource.utils';

const {
  ACA_CODEC_ENCODE_TYPES,
  encode,
} = require('@ibm-aca/aca-utils-codec');

const synchronizeWithDatabaseByTenant = async (context, params) => {
  let configPolicyManagerEngagementsAbsolutePath;
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
    configPolicyManagerEngagementsAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/engagements`;
    fsExtra.ensureDirSync(configPolicyManagerEngagementsAbsolutePath);

    const ENGAGEMENTS_FILES = fsExtra.readdirSync(configPolicyManagerEngagementsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(ENGAGEMENTS_FILES) &&
      lodash.isArray(ENGAGEMENTS_FILES)
    ) {
      for (const ENGAGEMENTS_JSON_FILE of ENGAGEMENTS_FILES) {
        if (
          !lodash.isEmpty(ENGAGEMENTS_JSON_FILE) &&
          lodash.isString(ENGAGEMENTS_JSON_FILE) &&
          ENGAGEMENTS_JSON_FILE.endsWith('.json')
        ) {

          const ENGAGEMENTS_JS_FILE = ENGAGEMENTS_JSON_FILE.replace('.json', '.js');

          const ENGAGEMENT = fsExtra.readJsonSync(`${configPolicyManagerEngagementsAbsolutePath}/${ENGAGEMENTS_JSON_FILE}`)
          const SCHEMA = fsExtra.readFileSync(`${configPolicyManagerEngagementsAbsolutePath}/${ENGAGEMENTS_JS_FILE}`)

          if (
            lodash.isEmpty(ENGAGEMENT?.styles)
          ) {
            ENGAGEMENT.schema = {};
          }
          ENGAGEMENT.schema.value = encode({
            input: SCHEMA,
            type: ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64,
          });

          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.validationEngagements.saveOne(context, { validationEngagement: ENGAGEMENT })
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
