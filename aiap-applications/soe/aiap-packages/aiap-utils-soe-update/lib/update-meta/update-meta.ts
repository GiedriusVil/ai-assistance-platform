/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-utils-soe-update-meta-update-meta`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';


const ensureUpdateMeta = (
  update: ISoeUpdateV1,
) => {
  const UPDATE_META = update?.meta;
  const UPDATE_META_DEFAULT = {};
  try {
    if (
      !UPDATE_META
    ) {
      setUpdateMeta(update, UPDATE_META_DEFAULT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureUpdateMeta.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const setUpdateMeta = (update, value) => {
  try {
    update.meta = value;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setUpdateMeta.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getUpdateMeta = (update) => {
  try {
    const RET_VAL = update?.meta;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getUpdateMeta.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ensureUpdateMeta,
  setUpdateMeta,
  getUpdateMeta,
}
