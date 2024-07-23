/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-access-save-one-to-memory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const { constructTokenIdForMemoryStore } = require('../../utils');

const saveOneToMemory = async (context, params) => {
  let memoryStore;
  let tokenId;
  try {
    if (
      lodash.isEmpty(params?.tokenAccess)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tokenAccess attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(
        context?.user?.session?.tenant?.id
      )
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.tenant?.integration?.tokenAccess?.secret attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    memoryStore = getMemoryStore();
    tokenId = constructTokenIdForMemoryStore(context, { token: params?.tokenAccess });
    await memoryStore.set(tokenId, params?.tokenAccess, params?.tokenAccess?.expiryLengthMs)
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOneToMemory.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOneToMemory,
}
