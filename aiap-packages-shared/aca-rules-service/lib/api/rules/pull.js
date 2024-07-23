/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-pull';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { AIAP_EVENT_TYPE, getEventStreamByContext } = require('@ibm-aiap/aiap-event-stream-provider');
const { rulesAuditorService } = require('@ibm-aca/aca-auditor-service');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _retrievePullSourceTenant = async (context) => {
  const SOURCE_TENANT_ID = context?.user?.session?.tenant?.pullTenant?.id;
  if (
    lodash.isEmpty(SOURCE_TENANT_ID)
  ) {
    const MESSAGE = `Missing required user.session.tenant.pullTenant.id parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const DATASOURCE = getDatasourceV1App();
  const RET_VAL = await DATASOURCE.tenants.findOneById(context, { id: SOURCE_TENANT_ID });
  return RET_VAL;
}

const _retrievePullSourceRules = async (context) => {
  const PULL_TENANT = await _retrievePullSourceTenant(context);
  if (
    lodash.isEmpty(PULL_TENANT)
  ) {
    const MESSAGE = `Unable to reitreve PULL_TENANT!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.BUSINESS_ERROR, MESSAGE);
  }
  const OVERRIDDEN_SESSION = lodash.cloneDeep(context);
  OVERRIDDEN_SESSION.user.session.tenant = PULL_TENANT;
  const DATASOURCE = getAcaRulesDatasourceByContext(OVERRIDDEN_SESSION);
  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.rules.findManyByQuery(OVERRIDDEN_SESSION, PARAMS);
  const RET_VAL = RESPONSE?.items;
  return RET_VAL;
}

const _retrieveCurrentRules = async (context) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.rules.findManyByQuery(context, PARAMS);
  const RET_VAL = RESPONSE?.items;
  return RET_VAL;
}

const _deployRule = async (context, params) => {
  const RULE = params?.rule;
  let retVal;
  if (
    !lodash.isEmpty(RULE)
  ) {
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const ID = params?.rule?.id;
    const AUDITOR_PARAMS = {
      action: 'SAVE_ONE_BY_PULL',
      docId: ID,
      docType: 'RULE',
      doc: RULE,
    };
    await rulesAuditorService.saveOne(context, AUDITOR_PARAMS);
    retVal = await DATASOURCE.rules.saveOne(context, { rule: RULE });
  }
  return retVal;
}

const _deployRules = async (context, params) => {
  const RULES = params?.rules;
  const PROMISES = [];
  if (
    !lodash.isEmpty(RULES) &&
    lodash.isArray(RULES)
  ) {
    for (let rule of RULES) {
      PROMISES.push(_deployRule(context, { rule }));
    }
  }
  const RET_VAL = Promise.all(PROMISES);
  return RET_VAL;
}

const _pull = async (context, params) => {
  const RULES_SOURCE = await _retrievePullSourceRules(context);
  const RULES_CURRENT = await _retrieveCurrentRules(context);
  const RULES_CHANGES = deepDifference({ rules: RULES_CURRENT }, { rules: RULES_SOURCE });

  const DATE = new Date();
  const RULES_PULL_RELEASE = {
    created: DATE,
    createdT: DATE.getTime(),
    deployed: DATE,
    deployedT: DATE.getTime(),
    _as_is: RULES_CURRENT,
    _to_be: RULES_SOURCE,
    _changes: RULES_CHANGES,
  };

  await _deployRules(context, { rules: RULES_SOURCE });
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.rulesReleases.saveOne(context, { release: RULES_PULL_RELEASE });
  getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
  return RET_VAL;
}

const pull = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _pull, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${pull.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  pull,
}
