/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-services-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  getDatasourceByContext,
  attachModelsAndExamplesToServices
} from '../utils';

import {
  IAiTranslationServicesExportManResponseV1,
  IAiTranslationServicesExportManyParamsV1
} from '../../types';


const exportMany = async (
  context: IContextV1,
  params: IAiTranslationServicesExportManyParamsV1
): Promise<IAiTranslationServicesExportManResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.aiTranslationServices.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    const ATTACH_PARAMS = {
      exportManyParams: params,
      services: RET_VAL,
    };
    
    await attachModelsAndExamplesToServices(context, ATTACH_PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  exportMany,
}
