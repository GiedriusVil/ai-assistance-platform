/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-delete-many-by-service-id';
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
  IAiTranslationPromptsDeleteManyByServiceIdParamsV1,
  IAiTranslationPromptsDeleteManyByServiceIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const deleteManyByServiceId = async (
  context: IContextV1,
  params: IAiTranslationPromptsDeleteManyByServiceIdParamsV1
): Promise<IAiTranslationPromptsDeleteManyByServiceIdResponseV1> => {
  const AI_TRANSLATION_SERVICE_ID: string = params?.aiTranslationServiceId;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    await Promise.all([
      DATASOURCE.aiTranslationPrompts.deleteManyByIds(context, { serviceIds: [AI_TRANSLATION_SERVICE_ID] }),
    ]);
    const RET_VAL = {
      status: 'SUCCEESS',
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByServiceId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByServiceId,
};
