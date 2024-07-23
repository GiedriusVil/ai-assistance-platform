/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-runtime-data-synchronize-with-database-ai-skills-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

export const synchronizeWithDatabaseAiSkillsByTenant = async (
  context: IContextV1,
  params: {
    configTenantCustomizerAbsolutePath: any,
    tenantId: any,
  },
) => {
  let configTenantCustomizerAiSkillsAbsolutePath;
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
    configTenantCustomizerAiSkillsAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/ai-skills`;
    fsExtra.ensureDirSync(configTenantCustomizerAiSkillsAbsolutePath);
    const AI_SKILLS_FILES = fsExtra.readdirSync(configTenantCustomizerAiSkillsAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(AI_SKILLS_FILES) &&
      lodash.isArray(AI_SKILLS_FILES)
    ) {
      for (const AI_SKILL_FILE of AI_SKILLS_FILES) {
        if (
          !lodash.isEmpty(AI_SKILL_FILE) &&
          lodash.isString(AI_SKILL_FILE) &&
          AI_SKILL_FILE.endsWith('.json')
        ) {
          const ENGAGEMENT = fsExtra.readJsonSync(`${configTenantCustomizerAiSkillsAbsolutePath}/${AI_SKILL_FILE}`)
          const DATASOURCE = getAiServicesDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.aiSkills.saveOne(context, { value: ENGAGEMENT })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseAiSkillsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
