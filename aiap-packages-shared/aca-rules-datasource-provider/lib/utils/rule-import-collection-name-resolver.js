/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-collection-name-resolver';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getConfiguration } = require('../configuration');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const getDynamicCollectionName = (context, prefix) => {
  try {
    const CONFIG = getConfiguration();

    if (
      lodash.isEmpty(context) || lodash.isEmpty(CONFIG) || lodash.isEmpty(prefix)
    ) {
      const MESSAGE = 'Required parameters are not provided! context, config, prefix';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const USER_ID = context?.user?.id;
    const PREFIX = CONFIG?.acaRulesDatasourceProvider?.[prefix];
    const COLLECTION_NAME = PREFIX + USER_ID;
    return COLLECTION_NAME;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { context, prefix });
    throw ACA_ERROR;
  }
}

const getRuleImportCollectionName = (context) => getDynamicCollectionName(context, 'rulesImportCollectionPrefix');
const getMessageImportCollectionName = (context) => getDynamicCollectionName(context, 'rulesMessagesImportCollectionPrefix');

module.exports = {
  getRuleImportCollectionName,
  getMessageImportCollectionName,
}
