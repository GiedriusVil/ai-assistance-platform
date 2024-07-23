/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiServiceV1,
  CHANGE_ACTION,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import {
  appendAuditInfo,
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import * as runtimeDataService from '../runtime-data';
import * as aiServicesChangesService from '../ai-services-changes';

import {
  findOneById,
} from './find-one-by-id';

import {
  syncOneById,
} from './sync-one-by-id';


export const saveOne = async (
  context: IContextV1,
  params: {
    value: IAiServiceV1,
    options?: {
      synchroniseAiSkills: any,
    },
  },
) => {
  const USER_ID = context?.user?.id;
  const SYNCHRONISE_AI_SKILLS = params?.options?.synchroniseAiSkills;
  const PARAMS_VALUE: IAiServiceV1 = params.value;
  let aiService: IAiServiceV1;
  let aiServiceId;
  try {
    appendAuditInfo(context, params?.value);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: {
        id: params?.value?.id,
      }
    });
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    aiService = await DATASOURCE.aiServices.saveOne(context, params);
    if (
      SYNCHRONISE_AI_SKILLS
    ) {
      await syncOneById(context, {
        id: aiService?.id,
      });
    }
    if (
      lodash.isEmpty(PARAMS_VALUE.id)
    ) {
      PARAMS_VALUE.id = aiService?.id;
    }

    const CHANGES_SERVICE_PARAMS = {
      value: PARAMS_VALUE,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await aiServicesChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    await runtimeDataService.synchronizeWithConfigDirectoryAiService(context, { value: aiService });

    const RET_VAL = aiService;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, aiServiceId });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
