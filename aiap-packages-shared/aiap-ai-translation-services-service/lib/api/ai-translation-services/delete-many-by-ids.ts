/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-services-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import { 
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationServicesDeleteManyByIdsParamsV1,
  IAiTranslationServicesDeleteManyByIdsResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  deleteManyByServiceId
} from '../ai-translation-models/delete-many-by-service-id';

import {
  aiTranslationServicesChangesService
} from '..';


const deleteManyByIds = async (
  context: IContextV1,
  params: IAiTranslationServicesDeleteManyByIdsParamsV1
): Promise<IAiTranslationServicesDeleteManyByIdsResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const IDS = params?.ids;

    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const CHANGES_PROMISES = IDS.map((id) => {
      const VALUE = {
        id: id,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
      };
      return aiTranslationServicesChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);

    const PROMISES = IDS.map((id) => {
      return deleteManyByServiceId(context, { aiTranslationServiceId: id });
    });

    // add prompts removal

    await Promise.all(PROMISES);

    const RET_VAL = await DATASOURCE.aiTranslationServices.deleteManyByIds(context, params);
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
