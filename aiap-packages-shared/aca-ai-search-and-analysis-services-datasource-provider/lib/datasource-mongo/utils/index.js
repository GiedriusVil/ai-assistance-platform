/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-datasource-mongo-ai-utils';

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { getEncrypter } = require('@ibm-aiap/aiap-utils-encrypter');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const encryptAiSearchAndAnalysisServicePassword = (secret, aiSearchAndAnalysisService) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiSearchAndAnalysisService)
  ) {
    const MESSAGE = `Missing required aiSearchAndAnalysisService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = aiSearchAndAnalysisService?.external?.password;
  if (
    lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    delete aiSearchAndAnalysisService.external.password;
  } else {
    const ENCRYPTOR = getEncrypter(secret);
    aiSearchAndAnalysisService.external.password = ENCRYPTOR.encrypt(SERVICE_PASSWORD);
  }
}

const decryptAiSearchAndAnalysisServicePassword = (secret, aiSearchAndAnalysisService) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(aiSearchAndAnalysisService)
  ) {
    const MESSAGE = `Missing required aiSearchAndAnalysisService parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const SERVICE_PASSWORD = aiSearchAndAnalysisService?.external?.password;
  if (
    !lodash.isEmpty(SERVICE_PASSWORD)
  ) {
    const ENCRYPTOR = getEncrypter(secret);
    aiSearchAndAnalysisService.external.password = JSON.parse(ENCRYPTOR.decrypt(SERVICE_PASSWORD));
  }
}

module.exports = {
  encryptAiSearchAndAnalysisServicePassword,
  decryptAiSearchAndAnalysisServicePassword,
}
