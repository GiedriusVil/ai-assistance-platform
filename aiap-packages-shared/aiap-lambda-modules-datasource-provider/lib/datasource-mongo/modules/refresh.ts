/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-modules-refresh';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';
import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import { findOneById } from './find-one-by-id';

import {
  IContextV1,
  ILambdaModuleV1
} from '@ibm-aiap/aiap--types-server';

import {
  LambdaModulesDatasourceMongoV1,
} from '../';

import {
  IFindLambdaModulesByQueryResponseV1,
} from '../../types';

const refresh = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1, 
  params: any): Promise<ILambdaModuleV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  let module;
  let moduleId;
  try {
    module = params?.value;
    if (lodash.isEmpty(module)) {
      const MESSAGE = `Missing required params.module parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    moduleId = ramda.pathOr(uuidv4(), ['id'], module);
    const RET_VAL = await findOneById(datasource, context, { id: moduleId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(`${refresh.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  refresh,
};
