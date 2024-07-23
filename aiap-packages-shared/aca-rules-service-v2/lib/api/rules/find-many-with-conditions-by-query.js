/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const _appendConditionsToRule = async (context, rule) => {
  let query;
  try {
    if (
      !lodash.isEmpty(rule?.id)
    ) {
      const DATASOURCE = getDatasourceByContext(context);
      query = {
        filter: {
          ruleId: rule?.id,
          status: {
            enabled: true
          }
        },
        pagination: {
          page: 1,
          size: 10000
        }
      };
      const RESPONSE = await DATASOURCE.rulesConditions.findManyByQuery(context, query);
      rule.conditions = RESPONSE?.items;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

const findManyWithConditionsByQuery = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.rules.findManyByQuery(context, params);

    if (
      !lodash.isEmpty(RET_VAL?.items) &&
      lodash.isArray(RET_VAL?.items)
    ) {
      const PROMISES = [];
      for (let rule of RET_VAL.items) {
        PROMISES.push(_appendConditionsToRule(context, rule));
      }
      await Promise.all(PROMISES);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyWithConditionsByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyWithConditionsByQuery,
}
