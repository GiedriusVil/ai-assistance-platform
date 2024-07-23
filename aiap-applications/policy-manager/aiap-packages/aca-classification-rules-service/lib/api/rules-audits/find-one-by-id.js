/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-service-rules-audits-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getClassificationRulesDatasource } = require('../datasource.utils');

const findOneById = async (context, params) => {
  try {
    const DATASOURCE = getClassificationRulesDatasource(context);
    const RET_VAL = await DATASOURCE.rulesAudits.findOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${findOneById.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


module.exports = {
  findOneById,
}
