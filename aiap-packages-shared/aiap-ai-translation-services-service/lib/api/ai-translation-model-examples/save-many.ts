/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-model-examples-save-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

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
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelExamplesSaveManyParamsV1,
  IAiTranslationModelExamplesSaveManyResponseV1
} from '../../types';

import {
  findOneById
} from './find-one-by-id';

import {
  getDatasourceByContext,
  transformExample
} from '../utils';

import {
  aiTranslationModelsChangesService
} from '..';


const saveMany = async (
  context: IContextV1,
  params: IAiTranslationModelExamplesSaveManyParamsV1,
): Promise<IAiTranslationModelExamplesSaveManyResponseV1> => {
  const USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const AI_TRANSLATION_MODEL_EXAMPLES = params?.aiTranslationModelExamples;

    if (
      !lodash.isArray(AI_TRANSLATION_MODEL_EXAMPLES)
    ) {
      const MESSAGE = `'Wrong type of params.aiTranslationModelExamples attribute! [Expected: Array]'`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const CHANGES_PROMISES = [];
    // It should go before DATASOURCE.aiTranslationModelExamples.saveOne, because there id is deleted and we can't find record for DIFFERENCES
    for (const example of AI_TRANSLATION_MODEL_EXAMPLES) {
      appendAuditInfo(context, example);
      const DIFFERENCES = await calcDiffByValue(context, {
        service: {
          findOneById,
        },
        value: example,
      });
      const CHANGES_PARAMS = {
        value: {
          id: example.modelId,
          created: example.created,
          updated: example.updated,
          source: example.source,
          target: example.target,
        },
        docType: 'AI TRANSLATION MODEL EXAMPLE',
        docChanges: DIFFERENCES,
        action: CHANGE_ACTION.SAVE_ONE,
      };

      CHANGES_PROMISES.push(aiTranslationModelsChangesService.saveOne(context, CHANGES_PARAMS));
    }
    
    const PROMISES = AI_TRANSLATION_MODEL_EXAMPLES.map((example) => {
      transformExample(example);
      return DATASOURCE.aiTranslationModelExamples.saveOne(context, { value: example });
    });

    await Promise.all(CHANGES_PROMISES);

    await Promise.all(PROMISES);

    const RET_VAL = {
      status: 'SAVE SUCCESS',
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error(saveMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveMany,
};
