/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Buffer } from 'buffer';

import * as ramda from 'ramda';
import * as lodash from 'lodash';
import { _errorX } from 'client-shared-utils';

const MODULE_ID = 'EncodeTestCaseScriptUtils';

export const encodeScriptWithBase64 = (testCase) => {
  try {
    const SCRIPT = testCase?.script;
    const CONVERSATION = ramda.path(['convos', 0], SCRIPT);
    const CONVERSATION_STEPS = CONVERSATION?.steps;
    if (!lodash.isEmpty(CONVERSATION_STEPS)) {
      CONVERSATION_STEPS.forEach(step => {
        const USER_RESPONSES = step?.me;
        const BOT_RESPONSES = step?.bot;
        if (!lodash.isEmpty(USER_RESPONSES)) {
          step.me = encodeResponses(USER_RESPONSES);
        }
        else if (!lodash.isEmpty(BOT_RESPONSES)) {
          step.bot = encodeResponses(BOT_RESPONSES);
        }
      });
    }
  } catch (error) {
    _errorX(MODULE_ID, 'decodeScriptWithBase64', { error });
    throw error;
  }
}

const encodeResponses = (responses) => {
  try {
    const RET_VAL = [];
    responses.forEach(response => {
      if (
        lodash.isString(response) &&
        !lodash.isEmpty(response)
      ) {
        const ENCODED_TEXT = Buffer.from(response, 'utf-8').toString('base64');
        RET_VAL.push(ENCODED_TEXT);
      } else {
        RET_VAL.push(response);
      }
    });
    return RET_VAL;
  } catch (error) {
    _errorX(MODULE_ID, 'encodeResponses', { error });
    throw error;
  }
}
