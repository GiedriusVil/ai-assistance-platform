/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-ai-services-service-tests-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiServiceTestV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

export const saveOne = async (
  context: IContextV1,
  params: {
    value: IAiServiceTestV1,
  },
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiServiceTests.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
