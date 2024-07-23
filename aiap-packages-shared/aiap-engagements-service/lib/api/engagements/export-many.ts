/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-engagements-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
  IEngagementV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IExportEngagementsParamsV1
} from '../../types';

import {
  getEngagementsDatasourceByContext
} from './../datasource.utils';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

export const exportMany = async (
  context: IContextV1,
  params: IExportEngagementsParamsV1
): Promise<Array<IEngagementV1>> => {
  try {
    const DATASOURCE = getEngagementsDatasourceByContext(context);
    const RESULT = await DATASOURCE.engagements.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
