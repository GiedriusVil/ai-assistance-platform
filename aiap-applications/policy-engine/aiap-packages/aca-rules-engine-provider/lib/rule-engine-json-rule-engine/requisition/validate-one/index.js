/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-json-rule-engine-requisition-validate'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { constructResponse } = require('./utils');

const { FactGroupByItemFields } = require('../../facts');

const _executeEngineWrapper = async (engine, fact) => {
  try {
    const RET_VAL = await engine.run(fact);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.type = ACA_ERROR_TYPE.JSON_RULE_ENGINE_ERROR;
    logger.error(_executeEngineWrapper.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _validateHeader = async (engine, context, document) => {
  try {
    const FACT_HEADER = { type: 'HEADER', ...document };
    const RET_VAL = await _executeEngineWrapper(engine, FACT_HEADER);
    RET_VAL.HEADER_VALIDATION_RESULTS = await constructResponse(context, null, RET_VAL.events);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_validateHeader.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _validateItemFieldGroups = async (engine, context, almanac) => {
  try {
    const ITEM_FIELD_GROUPS = await almanac.factValue(FactGroupByItemFields.NAME);
    const PROMISES = [];
    if (
      !lodash.isEmpty(ITEM_FIELD_GROUPS)
    ) {
      for (let key of Object.keys(ITEM_FIELD_GROUPS)) {
        const group = ITEM_FIELD_GROUPS[key];
        PROMISES.push(_validateGroups(engine, context, group.groups));
      }
    }
    const PROMISES_RESULTS = await Promise.all(PROMISES);
    const FILTER_RES = PROMISES_RESULTS.filter(el => !!el);
    const RET_VAL = lodash.flatten(FILTER_RES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_validateItemFieldGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _validateGroups = async (engine, context, groups) => {
  try {
    const PROMISES = [];
    if (
      !lodash.isEmpty(groups) &&
      lodash.isArray(groups)
    ) {
      for (let group of groups) {
        PROMISES.push(_validateGroup(engine, context, group));
      }
    }
    const PROMISES_RESULTS = await Promise.all(PROMISES);
    const FILTER_RES = PROMISES_RESULTS.filter(el => !!el);
    const RET_VAL = lodash.flatten(FILTER_RES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error)
    logger.error(_validateGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _validateGroup = async (engine, context, group) => {
  try {
    const FACT_GROUP = {
      type: 'GROUP',
      group: group
    }
    const VALIDATION_RESULT = await _executeEngineWrapper(engine, FACT_GROUP);

    const RET_VAL = await constructResponse(context, group, VALIDATION_RESULT.events);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_validateGroup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


const _validateItems = async (engine, context, document) => {
  let items;
  try {
    items = document?.items;
    const PROMISES = [];
    if (
      !lodash.isEmpty(items) &&
      lodash.isArray(items)
    ) {
      for (let item of items) {
        if (
          !lodash.isEmpty(item)
        ) {
          PROMISES.push(_validateItem(engine, context, item));
        }
      }
    }
    const PROMISES_RESULTS = await Promise.all(PROMISES);
    const RETVAL = PROMISES_RESULTS.filter(el => !!el);
    return RETVAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_validateItems.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _validateItem = async (engine, context, item) => {
  try {
    const ITEM_FACT = {
      type: 'ITEM',
      item: item
    }
    const VALIDATION_RESULT = await _executeEngineWrapper(engine, ITEM_FACT);
    const RET_VAL = await constructResponse(context, item, VALIDATION_RESULT.events);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_validateItem.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const validateOne = async (engine, context, params) => {
  let userId;
  let tenantId;

  let document;
  let documentId;
  try {
    userId = context?.user?.id;
    tenantId = context?.user?.session?.tenant?.id;

    document = params?.document;
    documentId = document?.id;
    if (
      lodash.isEmpty(document)
    ) {
      const ERROR_MESSAGE = `Missing required params.document attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const { almanac, HEADER_VALIDATION_RESULTS } = await _validateHeader(engine, context, document);
    const GROUPS_VALIDATION_RESULTS = await _validateItemFieldGroups(engine, context, almanac);
    const ITEMS_VALIDATION_RESULTS = await _validateItems(engine, context, document);
    const RET_VAL = {
      id: documentId,
      headerValidationResults: HEADER_VALIDATION_RESULTS,
      groupValidationResults: GROUPS_VALIDATION_RESULTS,
      itemValidationResults: lodash.flatten(ITEMS_VALIDATION_RESULTS)
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, tenantId, documentId })
    logger.error(validateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateOne,
}
