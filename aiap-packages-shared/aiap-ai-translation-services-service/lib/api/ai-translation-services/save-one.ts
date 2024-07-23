/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { 
  appendAuditInfo, 
  calcDiffByValue 
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION, IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationServicesSaveOneParamsV1,
  IAiTranslationServicesSaveOneResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  findOneById
} from './find-one-by-id';

import {
  aiTranslationServicesChangesService
} from '..';


const saveOne = async (
  context: IContextV1,
  params: IAiTranslationServicesSaveOneParamsV1
): Promise<IAiTranslationServicesSaveOneResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;

  try {
    appendAuditInfo(context, params?.value);

    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const CHANGES_SERVICE_PARAMS = {
      ...params,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await aiTranslationServicesChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationServices.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
};
