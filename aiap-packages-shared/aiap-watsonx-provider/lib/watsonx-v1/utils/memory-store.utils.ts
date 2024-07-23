/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watsonx-provider-watsonx-v1-utils-memory-store-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError, appendDataToError } from '@ibm-aca/aca-utils-errors';
import { getMemoryStore } from '@ibm-aiap/aiap-memory-store-provider';
import { getInstanceId } from '../../../index';

import { IWatsonxV1ConfigurationExternal } from '../types';


const getWatsonxMemoryStoreKey = (
  params: {
    external: IWatsonxV1ConfigurationExternal,
  }
) => {
  let instanceId;
  try {
    instanceId = getInstanceId(params.external);
    const RET_VAL = `aiap:watsonx_tokens:${instanceId}`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getWatsonxMemoryStoreKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getWatsonxIamToken = async (
  params: {
    external: IWatsonxV1ConfigurationExternal,
  }
) => {
  let memoryStore;
  let watsonxMemoryStoreKey;
  let retVal;
  try {
    memoryStore = getMemoryStore();
    watsonxMemoryStoreKey = getWatsonxMemoryStoreKey(params);
    retVal = await memoryStore.get(watsonxMemoryStoreKey);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(getWatsonxIamToken.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const setWatsonxIamToken = async (
  params: {
    iamTokenResponse: any,
    external: IWatsonxV1ConfigurationExternal,
  }
) => {
  let memoryStore;
  let watsonxMemoryStoreKey;
  let iamTokenResponse;
  let iamTokenExpirationInMs;
  let retVal;
  try {
    memoryStore = getMemoryStore();
    watsonxMemoryStoreKey = getWatsonxMemoryStoreKey(params);
    iamTokenResponse = params?.iamTokenResponse;
    iamTokenExpirationInMs = params?.iamTokenResponse?.expires_in*1000;
    retVal = await memoryStore.set(watsonxMemoryStoreKey, iamTokenResponse, iamTokenExpirationInMs);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(setWatsonxIamToken.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getWatsonxIamToken,
  setWatsonxIamToken,
}
