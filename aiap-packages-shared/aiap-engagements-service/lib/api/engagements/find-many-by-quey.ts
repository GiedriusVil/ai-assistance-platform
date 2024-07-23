/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-engagements-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindEngagementsByQueryParamsV1,
  IFindEngagementsByQueryResponseV1
} from '../../types';

export const findManyByQuery = async (
  context: IContextV1,
  params: IFindEngagementsByQueryParamsV1
): Promise<IFindEngagementsByQueryResponseV1> => {
  try {
    const DATASOURCE = getEngagementsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.engagements.findManyByQuery(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
