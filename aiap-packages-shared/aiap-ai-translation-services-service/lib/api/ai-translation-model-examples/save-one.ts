/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-model-examples-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelExamplesSaveOneParamsV1,
  IAiTranslationModelExamplesSaveOneResponseV1
} from '../../types';

import {
  getDatasourceByContext,
  transformExample
} from '../utils';


const saveOne = async (
  context: IContextV1,
  params: IAiTranslationModelExamplesSaveOneParamsV1
): Promise<IAiTranslationModelExamplesSaveOneResponseV1> => {
  const USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const AI_TRANSLATION_MODEL_EXAMPLE = params?.value;

    if (
      lodash.isEmpty(AI_TRANSLATION_MODEL_EXAMPLE)
    ) {
      const MESSAGE = `Missing required params.aiTranslationModelExample parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    transformExample(AI_TRANSLATION_MODEL_EXAMPLE);

    const RET_VAL = await DATASOURCE.aiTranslationModelExamples.saveOne(context, params);
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
