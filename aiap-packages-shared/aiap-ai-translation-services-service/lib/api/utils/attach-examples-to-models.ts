/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-attach-examples-to-models-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import { 
  formatIntoAcaError, 
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsFindManyByQueryParamsV1
} from '../../types';

import {
  getDatasourceByContext
} from './';


const attachExamplesToModel = async (
  context: IContextV1,
  params: {
    exportManyParams: IAiTranslationModelsFindManyByQueryParamsV1,
    model: IAiTranslationModelV1,
  }
): Promise<void> => {
  const EXPORT_MANY_PARAMS = params?.exportManyParams;
  const MODEL = params?.model;
  const MODEL_ID = MODEL?.id;
  const DATASOURCE = getDatasourceByContext(context);

  try {
    if (lodash.isEmpty(EXPORT_MANY_PARAMS?.filter)) {
      EXPORT_MANY_PARAMS.filter = {
        aiTranslationModelId: MODEL_ID
      };
    } else {
      EXPORT_MANY_PARAMS.filter.aiTranslationModelId = MODEL_ID;
    }
    const RESPONSE = await DATASOURCE.aiTranslationModelExamples
      .findManyByQuery(context, EXPORT_MANY_PARAMS);
    
    const EXAMPLES = RESPONSE?.items;
    if (
      lodash.isEmpty(EXAMPLES) ||
      !lodash.isArray(EXAMPLES)
    ) {
      logger.info('Ai Translation Model examples not found!', {
        exportManyParams: EXPORT_MANY_PARAMS,
        model: MODEL,
        examples: EXAMPLES
      });
      return;
    }
    MODEL.examples = EXAMPLES;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(attachExamplesToModel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const attachExamplesToModels = async (
  context: IContextV1,
  params: {
    exportManyParams: IAiTranslationModelsFindManyByQueryParamsV1,
    models: Array<IAiTranslationModelV1>
  }
): Promise<void> => {
  const EXPORT_MANY_PARAMS = params?.exportManyParams;
  const MODELS = params?.models;
  if (
    lodash.isEmpty(MODELS) ||
    !lodash.isArray(MODELS)
  ) {
    logger.info('Ai Translation Models not found!', { exportManyParams: EXPORT_MANY_PARAMS, models: MODELS });
    return;
  }

  const PROMISES = [];
  for (let model of MODELS) {
    const ATTACH_PARAMS = {
      exportManyParams: EXPORT_MANY_PARAMS,
      model,
    };
    PROMISES.push(attachExamplesToModel(context, ATTACH_PARAMS));
  }
  await Promise.all(PROMISES);
}

export {
  attachExamplesToModel,
  attachExamplesToModels
}
