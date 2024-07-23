/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-box-connector-express-routes-memory-store-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const _boxCredentialsKey = (params) => {
  let connectorId;
  try {
    connectorId = params?.connectorId;
    if (
      lodash.isEmpty(connectorId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.connectorId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL = `aiap:box_tokens:${connectorId}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_boxCredentialsKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getBoxCredentials = async (params) => {
  let memoryStore;
  let boxCredentialsKey;
  let retVal;
  try {
    memoryStore = getMemoryStore();
    boxCredentialsKey = _boxCredentialsKey(params);
    retVal = await memoryStore.get(boxCredentialsKey);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getBoxCredentials.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const setBoxCredentials = async (params) => {
  let memoryStore;
  let boxCredentialsKey;
  let boxCredentials;
  let retVal;
  try {
    memoryStore = getMemoryStore();
    boxCredentialsKey = _boxCredentialsKey(params);
    boxCredentials = params?.boxCredentials;
    retVal = await memoryStore.set(boxCredentialsKey, boxCredentials);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setBoxCredentials.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getBoxCredentials,
  setBoxCredentials,
}
