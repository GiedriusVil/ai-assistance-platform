/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-service-configurations-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { appendAuditInfo } from '@ibm-aiap/aiap-utils-audit';

import { getDatasourceByContext } from '../datasource.utils';

import * as runtimeDataService from '../runtime-data';

import {
  ISaveLambdaModuleConfigurationParamsV1
} from '../../types';

const saveOne = async (
  context: IContextV1, 
  params: ISaveLambdaModuleConfigurationParamsV1
  ) => {
  let value;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    value = params?.value;
    appendAuditInfo(context, value);

    const RET_VAL = await DATASOURCE.modulesConfigurations.saveOne(context, params);
    
    await runtimeDataService.synchronizeWithConfigDirectoryConfiguration(context, { moduleConfig: RET_VAL })
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
}
