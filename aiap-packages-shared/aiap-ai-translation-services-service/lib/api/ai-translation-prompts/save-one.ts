/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  appendAuditInfo, 
} from '@ibm-aiap/aiap-utils-audit';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationPromptsSaveOneParamsV1,
  IAiTranslationPromptsSaveOneResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  findOneById
} from './find-one-by-id';


const saveOne = async (
  context: IContextV1,
  params: IAiTranslationPromptsSaveOneParamsV1,
): Promise<IAiTranslationPromptsSaveOneResponseV1> => {
  const USER_ID = context?.user?.id;
  try {
    appendAuditInfo(context, params?.value);
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationPrompts.saveOne(context, params);
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
