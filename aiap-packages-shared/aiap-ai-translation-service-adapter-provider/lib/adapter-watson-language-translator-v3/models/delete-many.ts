/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-delete-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } from '@ibm-aca/aca-utils-errors';
import { deleteOne } from './delete-one';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IDeleteManyParamsV1 } from '../types/params';

const deleteMany = async (
  context: IContextV1,
  params: IDeleteManyParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODELS = params?.aiTranslationModels;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODELS)) {
      const MESSAGE = 'Missing required params.aiTranslationModels parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PROMISES = AI_TRANSLATION_MODELS.map((model) => {
      return deleteOne(context, {
        aiTranslationService: AI_TRANSLATION_SERVICE,
        aiTranslationModel: model
      });
    });

    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteMany,
};
