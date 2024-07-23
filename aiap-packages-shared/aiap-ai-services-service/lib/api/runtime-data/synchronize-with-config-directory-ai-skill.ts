/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-runtime-data-synchronize-with-config-directory-ai-skill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const path = require('path');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../../configuration';

export const synchronizeWithConfigDirectoryAiSkill = async (
  context: IContextV1,
  params: {
    value: IAiSkillV1,
  },
) => {
  const AIAP_DIR_CONFIG = process?.env?.AIAP_DIR_CONFIG;
  let configurationLocalSyncEnabled = false;
  let configAbsolutePath;
  try {
    configurationLocalSyncEnabled = getLibConfiguration().configurationLocalSyncEnabled;
    if (
      !lodash.isEmpty(AIAP_DIR_CONFIG) &&
      configurationLocalSyncEnabled
    ) {
      configAbsolutePath = path.resolve(__dirname, `../../../../../../${AIAP_DIR_CONFIG}`);
      if (
        !fsExtra.existsSync(configAbsolutePath)
      ) {
        const ERROR_MESSAGE = `Missing configuration repository!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      if (
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }

      if (
        lodash.isEmpty(params?.value?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter params?.value?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }
      const DIR_AI_SKILLS = `${configAbsolutePath}/runtime-data-local/tenant-customizer/${context?.user?.session?.tenant?.id}/ai-skills`;
      fsExtra.ensureDirSync(DIR_AI_SKILLS);

      let aiSkillFileName = ``;
      if (
        !lodash.isEmpty(params?.value?.aiServiceId)
      ) {
        aiSkillFileName = `${params?.value?.aiServiceId}`;
      }
      if (
        !lodash.isEmpty(params?.value?.name)
      ) {
        aiSkillFileName = `${aiSkillFileName}.${params?.value?.name}`;
      }
      aiSkillFileName = `${aiSkillFileName}.${params?.value?.id}.json`;

      fsExtra.writeFileSync(
        `${DIR_AI_SKILLS}/${aiSkillFileName}`,
        JSON.stringify(params?.value, null, 4)
      );
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(synchronizeWithConfigDirectoryAiSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
