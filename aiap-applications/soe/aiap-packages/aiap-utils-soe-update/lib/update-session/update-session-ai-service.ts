/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-soe-update-assistant-update-session-ai-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';

const ensureUpdateSessionAiService = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_AI_SERVICE = update?.session?.aiService;
  const UPDATE_SESSION_AI_SERVICE_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_AI_SERVICE)
    ) {
      setUpdateSessionAiService(update, UPDATE_SESSION_AI_SERVICE_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { UPDATE_SESSION_AI_SERVICE });
    logger.error(ensureUpdateSessionAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const setUpdateSessionAiService = (
  update: ISoeUpdateV1,
  value: IAiServiceV1,
) => {
  try {
    ensureUpdateSession(update);
    update.session.aiService = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionAiService = (
  update: ISoeUpdateV1,
): IAiServiceV1 => {
  try {
    const RET_VAL = update?.session?.aiService;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSessionAiService,
  setUpdateSessionAiService,
  getUpdateSessionAiService,
}
