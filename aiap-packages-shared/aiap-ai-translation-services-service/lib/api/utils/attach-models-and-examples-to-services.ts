/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-attach-models-and-examples-to-services-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationServiceV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  getDatasourceByContext,
  attachExamplesToModels
} from './../utils';

import {
  IAiTranslationServicesExportManyParamsV1
} from '../../types';


const attachModelsAndExamplesToService = async (
  context: IContextV1,
  params: {
    exportManyParams: IAiTranslationServicesExportManyParamsV1,
    service: IAiTranslationServiceV1
  }
) => {
  const EXPORT_MANY_PARAMS = params?.exportManyParams;
  const SERVICE = params?.service;
  const SERVICE_ID = SERVICE?.id;
  const DATASOURCE = getDatasourceByContext(context);

  try {
    if (lodash.isEmpty(EXPORT_MANY_PARAMS?.filter)) {
      EXPORT_MANY_PARAMS.filter = {
        aiTranslationServiceId: SERVICE_ID
      };
    } else {
      EXPORT_MANY_PARAMS.filter.aiTranslationServiceId = SERVICE_ID;
    }

    const RESPONSE = await DATASOURCE.aiTranslationModels.findManyByQuery(context, EXPORT_MANY_PARAMS);
    const MODELS = RESPONSE?.items;
    if (
      lodash.isEmpty(MODELS) ||
      !lodash.isArray(MODELS)
    ) {
      logger.info('Ai Translation Services models not found!', { exportManyParams: EXPORT_MANY_PARAMS, service: SERVICE, models: MODELS });
      return;
    }
    SERVICE.models = MODELS;
    const ATTACH_PARAMS = {
      exportManyParams: EXPORT_MANY_PARAMS,
      models: MODELS,
    };
    await attachExamplesToModels(context, ATTACH_PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(attachModelsAndExamplesToService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const attachModelsAndExamplesToServices = async (
  context: IContextV1,
  params: {
    exportManyParams: IAiTranslationServicesExportManyParamsV1,
    services: Array<IAiTranslationServiceV1>
  }
) => {
  const EXPORT_MANY_PARAMS = params?.exportManyParams;
  const SERVICES = params?.services;
  if (
    lodash.isEmpty(SERVICES) ||
    !lodash.isArray(SERVICES)
  ) {
    logger.info('Ai Translation Services not found!', {
      exportManyParams: EXPORT_MANY_PARAMS,
      services: SERVICES
    });
    return;
  }
  const PROMISES = [];
  for (let service of SERVICES) {
    const ATTACH_PARAMS = {
      exportManyParams: EXPORT_MANY_PARAMS,
      service,
    };
    PROMISES.push(attachModelsAndExamplesToService(context, ATTACH_PARAMS));
  }
  await Promise.all(PROMISES);
}

export {
  attachModelsAndExamplesToService,
  attachModelsAndExamplesToServices
}
