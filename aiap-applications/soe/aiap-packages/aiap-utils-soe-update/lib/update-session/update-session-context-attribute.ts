/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-soe-update-session-context-attribute`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  ensureUpdateSessionContext,
  getUpdateSessionContext,
} from './update-session-context';

const setUpdateSessionContextAttribute = (
  update: ISoeUpdateV1,
  name: string,
  value: any,
) => {
  try {
    ensureUpdateSessionContext(update);
    if (
      value
    ) {
      update.session.context[name] = value;
    } else {
      delete update.session.context[name];
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { name, value });
    logger.error(setUpdateSessionContextAttribute.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getUpdateSessionContextAttribute = (
  update: ISoeUpdateV1,
  name: string,
) => {
  try {
    if (
      lodash.isEmpty(name)
    ) {
      const MESSAGE = `Missing required name parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const UPDATE_SESSION_CONTEXT = getUpdateSessionContext(update);
    const RET_VAL = ramda.path([name], UPDATE_SESSION_CONTEXT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateSessionContextAttribute.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getUpdateSessionContextAttribute,
  setUpdateSessionContextAttribute,
}
