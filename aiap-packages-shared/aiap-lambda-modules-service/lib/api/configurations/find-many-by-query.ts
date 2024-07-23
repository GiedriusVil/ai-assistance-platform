/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-configurations-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { getDatasourceByContext } from '../datasource.utils';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import {
  IFindLambdaModulesConfigurationsByQueryParamsV1
} from '../../types';

const findManyByQuery = async (
  context: IContextV1, 
  params: IFindLambdaModulesConfigurationsByQueryParamsV1) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.modulesConfigurations.findManyByQuery(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findManyByQuery,
}
