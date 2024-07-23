/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-service-answer-stores-retrieve-pull-options';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { tenantsService } = require('@ibm-aiap/aiap-app-service');
const { findManyLiteByQuery } = require('./find-many-lite-by-query');

const _retrieveTenants = async (context) => {
  const CONTEXT_SESSION_TENANTS = ramda.path(['user', 'session', 'accessGroup', 'tenants'], context);
  const PROMISES = [];
  if (
    !lodash.isEmpty(CONTEXT_SESSION_TENANTS) &&
    lodash.isArray(CONTEXT_SESSION_TENANTS)
  ) {
    for (let contextTenant of CONTEXT_SESSION_TENANTS) {
      let contextTenantId = ramda.path(['id'], contextTenant);
      if (
        !lodash.isEmpty(contextTenantId)
      ) {
        let params = {
          id: contextTenantId
        }
        PROMISES.push(tenantsService.findOneById(context, params))
      }
    }
  }
  const RET_VAL = await Promise.all(PROMISES);
  return RET_VAL;
}

const _sanitizedTenant = (tenant) => {
  const RET_VAL = lodash.cloneDeep(tenant);
  delete RET_VAL.datasources;
  return RET_VAL;
}

const _sanitizeAnswerStore = (store) => {
  const RET_VAL = lodash.cloneDeep(store);
  delete RET_VAL.answers;
  return RET_VAL;
}

const _retrieveAnswerStoresByAssistant = async (context, tenant, params) => {
  const ASSISTANT = ramda.path(['assistant'], params);
  const ASSISTANT_ID = ramda.path(['id'], ASSISTANT);
  const PARAMS = {
    assistantId: ASSISTANT_ID,
    pagination: {
      page: 1,
      size: 1000
    }
  }
  const CONTEXT = lodash.cloneDeep(context);

  CONTEXT.user.session.tenant = tenant;

  const FOUND = await findManyLiteByQuery(CONTEXT, PARAMS);
  const FOUND_ANSWER_STORES = ramda.pathOr([], ['items'], FOUND);
  const RET_VAL = [];
  if (
    !lodash.isEmpty(FOUND_ANSWER_STORES) &&
    lodash.isArray(FOUND_ANSWER_STORES)
  ) {
    for (let answerStore of FOUND_ANSWER_STORES) {
      if (
        !lodash.isEmpty(answerStore)
      ) {
        RET_VAL.push({
          tenant: _sanitizedTenant(tenant),
          assistant: ASSISTANT,
          answerStore: _sanitizeAnswerStore(answerStore),
        });
      }
    }
  }
  return RET_VAL;
}

const _retrievePullOptions = async (context, tenants, params) => {
  const PROMISES = [];
  if (
    !lodash.isEmpty(tenants) &&
    lodash.isArray(tenants)
  ) {
    for (let tenant of tenants) {
      if (
        !lodash.isEmpty(tenant)
      ) {
        PROMISES.push(_retrieveAnswerStoresByAssistant(context, tenant, params));
      }
    }
  }
  const PROMISES_VALS = await Promise.all(PROMISES);
  const RET_VAL = [];
  for (let value of PROMISES_VALS) {
    RET_VAL.push(...value);
  }
  return RET_VAL;
}

const retrievePullOptions = async (context, params) => {
  try {
    const TENANTS = await _retrieveTenants(context);
    const RET_VAL = await _retrievePullOptions(context, TENANTS, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  retrievePullOptions,
}
