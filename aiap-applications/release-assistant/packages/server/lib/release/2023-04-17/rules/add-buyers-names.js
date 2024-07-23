/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2023-04-17-rules-add-buyers-names`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const addBuyersNames = (rules, organizations) => {
  try {
    const RET_VAL = rules.map((rule) => addBuyerName(rule, organizations))
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addBuyersNames.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const addBuyerName = (rule, organizations) => {
  const RET_VAL = lodash.cloneDeep(rule);

  const ORG = organizations.find((org) => org.id === rule.buyer.id);
  RET_VAL.buyer.name = ORG.name ?? 'UNKNOWN';

  return RET_VAL;
};

module.exports = {
  addBuyersNames,
};
