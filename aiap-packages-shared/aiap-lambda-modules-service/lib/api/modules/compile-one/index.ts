/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-compile-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import jshint from 'jshint';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';
import { compileCode } from './compile-code';

import {
  ICompileLambdaModulesCodeParams,
} from '../../../types';

const compileOne = async (
  context: IContextV1, 
  params: ICompileLambdaModulesCodeParams
  ) => {
  try {
    const CODE = params?.code;
    const DECODED_CODE = Buffer.from(CODE, 'base64').toString('utf-8');
    jshint.JSHINT(DECODED_CODE, {
      esversion: 6
    });
    const LINT_ERRORS = jshint.JSHINT.data().errors.map(e => {
      return {
        line: e.line,
        character: e.character,
        message: e.raw,
        severity: e.code
      }
    });
    if (!lodash.isEmpty(LINT_ERRORS)) {
      for (let index = 0; index < LINT_ERRORS.length; index++) {
        let error = LINT_ERRORS[index];
        if (!lodash.isEmpty(error) &&
          !lodash.isEmpty(error.severity) &&
          error.severity.startsWith('E')) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, LINT_ERRORS);
          logger.error(compileOne.name, { ACA_ERROR });
          throw ACA_ERROR;
        }
      }
      logger.warn(compileOne.name, { LINT_ERRORS });
    }
    await compileCode(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(compileOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  compileOne,
}
