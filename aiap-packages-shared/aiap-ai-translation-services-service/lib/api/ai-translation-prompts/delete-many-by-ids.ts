/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationPromptsDeleteManyByIdsParamsV1,
  IAiTranslationPromptsDeleteManyByIdsResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

const deleteManyByIds = async (
  context: IContextV1,
  params: IAiTranslationPromptsDeleteManyByIdsParamsV1,
): Promise<IAiTranslationPromptsDeleteManyByIdsResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const IDS = params?.ids;
    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = await DATASOURCE.aiTranslationPrompts.deleteManyByIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByIds,
}
