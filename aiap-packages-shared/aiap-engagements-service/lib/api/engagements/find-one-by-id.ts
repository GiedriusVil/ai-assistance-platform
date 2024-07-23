/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-engagements-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
  IEngagementV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

export const findOneById = async (
  context: IContextV1,
  params: {
    id: any
  },
): Promise<IEngagementV1> => {
  try {
    const DATASOURCE = getEngagementsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.engagements.findOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
