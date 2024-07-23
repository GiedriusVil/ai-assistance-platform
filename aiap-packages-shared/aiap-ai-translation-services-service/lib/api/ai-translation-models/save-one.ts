/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { 
  appendAuditInfo, 
  calcDiffByValue 
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelsSaveOneParamsV1,
  IAiTranslationModelsSaveOneResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  findOneById
} from './find-one-by-id';

import {
  aiTranslationModelsChangesService
} from '..';


const saveOne = async (
  context: IContextV1,
  params: IAiTranslationModelsSaveOneParamsV1
): Promise<IAiTranslationModelsSaveOneResponseV1> => {
  const USER_ID = context?.user?.id;
  try {
    appendAuditInfo(context, params?.value);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationModels.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await aiTranslationModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
};
