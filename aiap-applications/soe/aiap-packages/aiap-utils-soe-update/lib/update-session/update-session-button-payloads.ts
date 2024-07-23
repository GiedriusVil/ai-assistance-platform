/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-button-payloads`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSession,
} from './update-session';


const ensureUpdateSessionButtonPayloads = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_SESSION_BUTTON_PAYLOADS = update?.session?.buttonPayloads;
  const UPDATE_SESSION_BUTTON_PAYLOADS_DEFAULT = {};
  try {
    ensureUpdateSession(update);
    if (
      lodash.isEmpty(UPDATE_SESSION_BUTTON_PAYLOADS)
    ) {
      setUpdateSessionButtonPayloads(update, UPDATE_SESSION_BUTTON_PAYLOADS_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateSessionButtonPayloads.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateSessionButtonPayloads = (
  update: ISoeUpdateV1,
  value: any,
) => {
  try {
    ensureUpdateSession(update);
    update.session.conversation = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateSessionButtonPayloads.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateSessionButtonPayloads = (
  update: ISoeUpdateV1,
) => {
  try {
    const RET_VAL = update?.session?.buttonPayloads;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionButtonPayloads.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateSessionButtonPayloads,
  setUpdateSessionButtonPayloads,
  getUpdateSessionButtonPayloads,
}
