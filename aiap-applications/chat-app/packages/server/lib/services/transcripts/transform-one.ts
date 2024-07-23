/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-services-transcripts-transform-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  testCasesService
} from '@ibm-aca/aca-test-cases-service';

const transformOne = async (context,params) => {
  try {

    const TEST_CASE = params?.testCase;
    const TEST_CASE_NAME = TEST_CASE?.name;
    const TEST_CASE_DESCRIPTION = TEST_CASE?.description;
    const TEST_CASE_KEY = TEST_CASE?.key;
    if (
      lodash.isEmpty(TEST_CASE_NAME)
    ) {
      const MESSAGE = `Missing required param tenant.testCase.name`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TEST_CASE_DESCRIPTION)
    ) {
      const MESSAGE = `Missing required param tenant.testCase.description`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TEST_CASE_KEY)
    ) {
      const MESSAGE = `Missing required param tenant.testCase.key`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    
    const RET_VAL = await testCasesService.transformOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  transformOne,
};
