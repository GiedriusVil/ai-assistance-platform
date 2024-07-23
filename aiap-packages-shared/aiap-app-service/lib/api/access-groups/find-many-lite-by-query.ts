/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `app-service-access-groups-find-many-lite-by-query`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindAccessGroupsLiteByQuery,
  IResponseV1FindAccessGroupsLiteByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const findManyLiteByQuery = async (
  context: IContextV1,
  params: IParamsV1FindAccessGroupsLiteByQuery,
): Promise<IResponseV1FindAccessGroupsLiteByQuery> => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.accessGroups.findManyLiteByQuery(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyLiteByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
