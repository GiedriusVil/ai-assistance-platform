/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-import-upload';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { xlsToRules } = require('@ibm-aiap/aiap-utils-xlsx');
const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const {
  constructActionContextFromRequest,
} = require('@ibm-aiap/aiap-utils-express-routes');

const {
  rulesService,
  rulesMessagesService,
  rulesImportService,
} = require('@ibm-aca/aca-rules-service');

const { organizationsService } = require('@ibm-aca/aca-organizations-service');

const importRulesFromFile = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const ACTION = {
    create: 'CREATE',
    update: 'UPDATE',
    delete: 'DELETE',
  };
  let result = [];

  try {
    const IMPORT_FILE = request?.files?.rulesFile;
    const RULE_ITEMS = await xlsToRules(CONTEXT, IMPORT_FILE);

    if (!lodash.isEmpty(RULE_ITEMS)) {
      const DELETE_RULE_ITEMS = RULE_ITEMS.filter((ruleItem) =>
        ruleItem.action === ACTION.delete
      );

      if (!lodash.isEmpty(DELETE_RULE_ITEMS)) {
        DELETE_RULE_ITEMS.forEach((ruleItem) =>
          rulesService.deleteOneById(CONTEXT, ruleItem.rule)
        );
      }

      const CREATE_UPDATE_RULES_ITEMS = RULE_ITEMS.filter(ruleItem =>
        ruleItem.action === ACTION.create || ruleItem.action === ACTION.update
      );

      if (!lodash.isEmpty(CREATE_UPDATE_RULES_ITEMS)) {
        await _mapMessagesAndBuyersOntoRules(CONTEXT, CREATE_UPDATE_RULES_ITEMS);
        result = await _saveImportRules(CONTEXT, CREATE_UPDATE_RULES_ITEMS);
      }
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(importRulesFromFile.name, { ERRORS });
    response.status(400).json(ERRORS);
  }
};

const _mapMessagesAndBuyersOntoRules = async (context, rules) => {
  const PARAMS = {
    sort: {
      field: 'id',
      direction: 'asc',
    },
  };

  const MESSAGES = await rulesMessagesService.findManyByQuery(context, PARAMS);
  const ORGANIZATIONS = await organizationsService.findManyByQuery(context, PARAMS);

  rules.forEach((ruleItem) => {
    const RULE = ruleItem.rule;
    _mapMessageOntoRule(RULE, MESSAGES);
    _mapBuyerOntoRule(RULE, ORGANIZATIONS);
  });
};

const _mapMessageOntoRule = (rule, messages) => {
  const MESSAGE_FROM_DB = messages.items.find(message =>
    message.id === rule.code
  );
  const DEFAULT_MESSAGE = {
    id: rule.code,
    code: '',
    name: '',
    templates: [],
  };

  rule.message = MESSAGE_FROM_DB ?? DEFAULT_MESSAGE;
};

const _mapBuyerOntoRule = (rule, organizations) => {
  const ORGANIZATION_FROM_DB = organizations.items.find(org =>
    org.id === rule.buyer.id
  );
  const DEFAULT_ORGANIZATION = {
    id: rule.buyer.id,
    name: 'UNKNWON',
  };

  rule.buyer = ORGANIZATION_FROM_DB ?? DEFAULT_ORGANIZATION;
};

const _saveImportRules = async (context, rules) => {
  const PROMISES = rules.map((ruleItem) => rulesImportService.saveOne(context, { rule: ruleItem.rule }))
  const RET_VAL = await Promise.all(PROMISES);
  return RET_VAL;
};

module.exports = {
  importRulesFromFile,
};
