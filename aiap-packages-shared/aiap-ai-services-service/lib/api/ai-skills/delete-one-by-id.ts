/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-skills-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

export const deleteOneById = async (
  context: IContextV1,
  params: {
    id: any,
  },
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiSkills.deleteOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
