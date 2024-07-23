/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-delete-many-by-prompts-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationPromptsDeleteManyByPromptIdsParamsV1,
  IAiTranslationPromptsDeleteManyByPromptIdsResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const deleteManyByPromptsIds = async (
  context: IContextV1,
  params: IAiTranslationPromptsDeleteManyByPromptIdsParamsV1,
): Promise<IAiTranslationPromptsDeleteManyByPromptIdsResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const IDS = params?.ids;
    if (lodash.isEmpty(IDS)) {
      const MESSAGE = `Missing params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    await Promise.all([
      DATASOURCE.aiTranslationPrompts.deleteManyByIds(context, params),
    ]);
    const RET_VAL = {
      status: 'Success',
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByPromptsIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByPromptsIds,
};
