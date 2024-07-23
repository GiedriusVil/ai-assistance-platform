/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-json-rule-engine-requisition-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  rulesMessagesService
} = require('@ibm-aca/aca-rules-service');

const mustache = require('@ibm-aca/aca-wrapper-mustache');

const _createConditionsObject = rule => {
  let conditionsObject = {};
  const CONDITIONS = rule?.conditions;
  if (
    !lodash.isEmpty(CONDITIONS)
  ) {
    CONDITIONS.forEach((condition, index) => {
      conditionsObject[index] = condition;
    });
  } else {
    logger.info(`No conditions found for rule: ${rule.name}`);
  }
  return conditionsObject;
}

const _getMessageByLanguage = async (rule, language, context) => {
  const RULE_MESSAGE_ID = rule?.message?.id;
  const MESSAGE = await rulesMessagesService.findOneById(context, {
    id: RULE_MESSAGE_ID
  });
  const MESSAGE_CODE = MESSAGE?.code ?? `Message code not found`;
  const MESSAGE_TEMPLATES = MESSAGE?.templates || [];

  const FOUND_TEMPLATE = MESSAGE_TEMPLATES.find(template => template.language == language) || MESSAGE_TEMPLATES.find(template => template.language == 'en-gb');
  const MAPPED_MESSAGE = FOUND_TEMPLATE ? FOUND_TEMPLATE.message : 'Message not found';
  const TRANSFORMED_MESSAGE = mustache.render(MAPPED_MESSAGE, {
    conditions: _createConditionsObject(rule),
    rule: rule,
  });

  const RET_VAL = {
    code: MESSAGE_CODE,
    text: TRANSFORMED_MESSAGE
  };

  return RET_VAL;
}

const _retrieveLanguageFromContext = (context) => {
  const RET_VAL = context?.user?.session?.tenant?.language || 'en-gb';
  return RET_VAL;
}


const constructResponse = async (context, fact, events) => {
  const LANGUAGE = _retrieveLanguageFromContext(context);
  const FACT_ID = fact?.id;
  const FACT_IDS = fact?.ids;
  const FACT_STATUS = fact?.status || '';

  const RET_VAL = [];

  for (let event of events) {

    const ACTIONS = event?.params?.actions;
    const RULE = event?.params?.rule;
    const DATA = event?.params;

    const MESSAGE_REQUESTED = await _getMessageByLanguage(RULE, LANGUAGE, context);
    const MESSAGE_ORIGINAL = await _getMessageByLanguage(RULE, 'en-gb', context);

    RET_VAL.push({
      id: FACT_ID,
      ids: FACT_IDS,
      messageCode: MESSAGE_ORIGINAL.code,
      message: MESSAGE_REQUESTED.text,
      messageOriginal: MESSAGE_ORIGINAL.text,
      actions: ACTIONS,
      data: DATA,
      status: FACT_STATUS
    })
  }

  return RET_VAL;
};

module.exports = {
  constructResponse
}
