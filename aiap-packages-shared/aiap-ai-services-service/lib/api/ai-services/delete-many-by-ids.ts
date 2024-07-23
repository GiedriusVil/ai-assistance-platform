/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import * as runtimeDataService from '../runtime-data';
import * as aiServicesChangesService from '../ai-services-changes';
import * as aiSkillsService from '../ai-skills';


const _deleteAiSkillsByAiServiceIds = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
  },
) => {
  try {
    const CHANGES_PROMISES = [];
    const PROMISES = [];
    if (
      !lodash.isEmpty(params?.ids) &&
      lodash.isArray(params?.ids)
    ) {
      for (const ID of params.ids) {
        if (
          !lodash.isEmpty(ID)
        ) {
          const VALUE = {
            id: ID,
          };
          appendAuditInfo(context, VALUE);
          const CHANGES_SERVICE_PARAMS = {
            value: VALUE,
            docChanges: [],
            action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
          };
          CHANGES_PROMISES.push(aiServicesChangesService.saveOne(context, CHANGES_SERVICE_PARAMS));
          PROMISES.push(aiSkillsService.deleteManyByAiServiceId(context, { aiServiceId: ID }));
        }
      }
    }
    await Promise.all(CHANGES_PROMISES);
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_deleteAiSkillsByAiServiceIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const deleteManyByIds = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
  },
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiServices.deleteManyByIds(context, params);
    await runtimeDataService.deleteManyByIdsFromConfigDirectoryAiService(context, params);
    await _deleteAiSkillsByAiServiceIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
