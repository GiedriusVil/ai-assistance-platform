/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-compile-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { compileOne } = require('@ibm-aca/aca-lambda-modules-executor');

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  ICompileLambdaModulesCodeParams
} from '../../../types';

const compileCode = async (
  context: IContextV1, 
  params: ICompileLambdaModulesCodeParams
  ) => {
  if (lodash.isEmpty(params)) {
    const MESSAGE = 'Required parameters was not found';
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
    appendDataToError(ACA_ERROR, { params });
    logger.error(compileCode.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

  const CODE = params?.code;

  if (lodash.isEmpty(CODE)) {
    const MESSAGE = "Required parameter 'module.code' was not found";
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
    appendDataToError(ACA_ERROR, { params });
    logger.error(compileCode.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

  let response;
  try {
    response = await compileOne(params);
  } catch (error) {
    const ERROR = ramda.pathOr(error, ['body', 'errors'], error);
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, ERROR);
    appendDataToError(ACA_ERROR, { params });
    logger.error(compileCode.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

  if (lodash.isEmpty(response)) {
    const MESSAGE = 'No response was provided';
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
    appendDataToError(ACA_ERROR, { params });
    logger.error(compileCode.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
export {
  compileCode,
}
