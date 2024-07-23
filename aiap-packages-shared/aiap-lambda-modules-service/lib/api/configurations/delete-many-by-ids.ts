/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-configurations-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { getDatasourceByContext } from '../datasource.utils';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import * as runtimeDataService from '../runtime-data';

import { IDeleteLambdaModulesConfigurationsByIdsResponseV1 } from '../../types';

const deleteManyByIds = async (
  context: IContextV1, 
  params: {
    ids: Array<any>
  }
): Promise<IDeleteLambdaModulesConfigurationsByIdsResponseV1> => {
  let ids;

  let retVal;
  try {
    ids = params?.ids;
    const DATASOURCE = getDatasourceByContext(context);
    retVal = await DATASOURCE.modulesConfigurations.deleteManyByIds(context, params);
    await runtimeDataService.deleteManyByIdsFromConfigDirectoryConfiguration(context, { ids });
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByIds,
}
