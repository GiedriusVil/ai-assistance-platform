/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-cases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const decodeScriptWithBase64 = (params) => {
  try {
    const TEST_CASE = params?.testCase;
    const SCRIPT = TEST_CASE?.script;
    const CONVERSATION = ramda.path(['convos', 0], SCRIPT);
    const CONVERSATION_STEPS = CONVERSATION?.steps;
    if (!lodash.isEmpty(CONVERSATION_STEPS)) {
      CONVERSATION_STEPS.forEach(step => {
        const USER_RESPONSES = step?.me;
        const BOT_RESPONSES = step?.bot;
        if (!lodash.isEmpty(USER_RESPONSES)) {
          step.me = decodeResponses(USER_RESPONSES);
        }
        else if (!lodash.isEmpty(BOT_RESPONSES)) {
          step.bot = decodeResponses(BOT_RESPONSES);
        }
      });
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${decodeScriptWithBase64.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const decodeResponses = (responses) => {
  try {
    const RET_VAL = [];
    responses.forEach(response => {
      if (
        lodash.isString(response) &&
        !lodash.isEmpty(response)
      ) {
        const DECODED_TEXT = Buffer.from(response, 'base64').toString('utf-8');
        RET_VAL.push(DECODED_TEXT);
      } else {
        RET_VAL.push(response);
      }
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${decodeResponses.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    decodeScriptWithBase64(params);
    const RET_VAL = await DATASOURCE.cases.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
