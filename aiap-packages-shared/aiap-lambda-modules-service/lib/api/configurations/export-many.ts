/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-configurations-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { getDatasourceByContext } from './../datasource.utils';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import {
  IExportLambdaModulesConfigurationsParamsV1
} from '../../types';

const exportMany = async (context: IContextV1, params: IExportLambdaModulesConfigurationsParamsV1) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.modulesConfigurations.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export{
  exportMany,
}
