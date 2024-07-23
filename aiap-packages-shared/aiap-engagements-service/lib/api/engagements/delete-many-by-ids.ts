/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteEngagementsByIdsResponseV1
} from '../../types';

import * as runtimeDataService from '../runtime-data';
import * as engagementsChangesService from '../engagements-changes';

export const deleteManyByIds = async (
  context: IContextV1,
  params: {
    ids: Array<any>
  }
): Promise<IDeleteEngagementsByIdsResponseV1> => {
  let ids;
  try {
    ids = params?.ids;

    const CHANGES_PROMISES = ids.map((ID: any) => {
      const VALUE = {
        id: ID,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
      };
      return engagementsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);

    const DATASOURCE = getEngagementsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.engagements.deleteManyByIds(context, params);

    await runtimeDataService.deleteManyByIdsFromDirectoryEngagement(context, { ids });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
