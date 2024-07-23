/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-ai-skills-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import * as runtimeDataService from '../runtime-data';

export const saveOne = async (
  context: IContextV1,
  params: {
    value: IAiSkillV1,
  }
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    appendAuditInfo(context, params?.value);
    const RET_VAL = await DATASOURCE.aiSkills.saveOne(context, params);
    await runtimeDataService.synchronizeWithConfigDirectoryAiSkill(context, { value: RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
