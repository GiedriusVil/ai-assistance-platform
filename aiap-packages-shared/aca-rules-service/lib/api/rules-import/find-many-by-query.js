/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-import-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
    transformToAcaErrorFormat,
} = require('@ibm-aca/aca-data-transformer');

const {
    getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const {
  organizationsService
} = require('@ibm-aca/aca-organizations-service');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyByQuery = async (context, params) => {
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const DATASOURCE_RESULT = await DATASOURCE.rulesImport.findManyByQuery(context, params);
    const DATASOURCE_ITEMS = ramda.pathOr([], ['items'], DATASOURCE_RESULT);
    const DATASOURCE_TOTAL = ramda.pathOr(0, ['total'], DATASOURCE_RESULT);
    const RULES = [];

    for (let rule of DATASOURCE_ITEMS) {
      let messageId = ramda.path(['message', 'id'], rule);
      let message = await DATASOURCE.rulesMessages.findOneById(context, {id:messageId});
      let messageExists = !lodash.isEmpty(message);
      rule = ramda.assocPath(['status', 'selectedMessageExists'], messageExists, rule);

      let buyerId = ramda.path(['buyer', 'id'], rule);
      let buyer;
      if (!lodash.isEmpty(buyerId)) {
        buyer = await organizationsService.findOneById(context, {id:buyerId});
      }
      let buyerExists = !lodash.isEmpty(buyer);
      rule = ramda.assocPath(['status', 'selectedBuyerExists'], buyerExists, rule);

      RULES.push(rule);

      let updateRuleParams = {
        rule: rule
      };
      DATASOURCE.rulesImport.saveOne(context, updateRuleParams);
    }

    const RET_VAL = {
      items: RULES,
      total: DATASOURCE_TOTAL,
    };

    return RET_VAL;
}

const findManyByQuery = async (context, params) => {
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManyByQuery, context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
};

module.exports = {
    findManyByQuery,
}
