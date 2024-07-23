/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-messages-pull';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');

const {
  transformToAcaErrorFormat,
} = require('@ibm-aca/aca-data-transformer');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const {
  getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { messagesAuditorService } = require('@ibm-aca/aca-auditor-service');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _retrievePullSourceTenant = async (context) => {
  const SOURCE_TENANT_ID = ramda.path(['user', 'session', 'tenant', 'pullTenant', 'id'], context);
  if (
    lodash.isEmpty(SOURCE_TENANT_ID)
  ) {
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `[${MODULE_ID}] Missing required user.session.tenant.pullTenant.id attribute!`
    }
    throw ACA_ERROR;
  }
  const DATASOURCE = getDatasourceV1App();
  const RET_VAL = await DATASOURCE.tenants.findOneById(context, { id: SOURCE_TENANT_ID });
  return RET_VAL;
}

const _retrievePullSourceMessages = async (context) => {
  const PULL_TENANT = await _retrievePullSourceTenant(context);
  if (
    lodash.isEmpty(PULL_TENANT)
  ) {
    const ACA_ERROR = {
      type: 'BUSINESS_ERROR',
      message: `[${MODULE_ID}] Unable retrieve PULL_TENANT`
    };
    throw ACA_ERROR;
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
  const RESPONSE = await DATASOURCE.rulesMessages.findManyByQuery(OVERRIDDEN_SESSION, PARAMS);
  const RET_VAL = ramda.path(['items'], RESPONSE);
  return RET_VAL;
}

const _retrieveCurrentMessages = async (context) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.rulesMessages.findManyByQuery(context, PARAMS);
  const RET_VAL = ramda.path(['items'], RESPONSE);
  return RET_VAL;
}

const _deployMessage = async (context, params) => {
  const MESSAGE = ramda.path(['message'], params);
  let retVal;
  if (
    !lodash.isEmpty(MESSAGE)
  ) {
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const ID = ramda.path(['message', 'id'], params);
    const AUDITOR_PARAMS = {
      action: 'SAVE_ONE_BY_PULL',
      docId: ID,
      docType: 'MESSAGE',
      doc: MESSAGE,
    };
    await messagesAuditorService.saveOne(context, AUDITOR_PARAMS);
    retVal = await DATASOURCE.rulesMessages.saveOne(context, { message: MESSAGE });
  }
  return retVal;
}

const _deployMessages = async (context, params) => {
  const MESSAGES = ramda.path(['messages'], params);
  const PROMISES = [];
  if (
    !lodash.isEmpty(MESSAGES) &&
    lodash.isArray(MESSAGES)
  ) {
    for (let message of MESSAGES) {
      PROMISES.push(_deployMessage(context, { message }));
    }
  }
  const RET_VAL = Promise.all(PROMISES);
  return RET_VAL;
}

const _pull = async (context, params) => {
  const MESSAGES_SOURCE = await _retrievePullSourceMessages(context);
  const MESSAGES_CURRENT = await _retrieveCurrentMessages(context);
  const MESSAGES_CHANGES = deepDifference({ messages: MESSAGES_CURRENT }, { messages: MESSAGES_SOURCE });

  const DATE = new Date();
  const MESSAGES_PULL_RELEASE = {
    created: DATE,
    createdT: DATE.getTime(),
    deployed: DATE,
    deployedT: DATE.getTime(),
    _as_is: MESSAGES_CURRENT,
    _to_be: MESSAGES_SOURCE,
    _changes: MESSAGES_CHANGES,
  };

  await _deployMessages(context, { messages: MESSAGES_SOURCE });
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.messageReleases.saveOne(context, { release: MESSAGES_PULL_RELEASE });
  const EVENT_STREAM = getEventStreamByContext(context);
  EVENT_STREAM.publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
  return RET_VAL;
}

const pull = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _pull, context, params);
    return RET_VAL
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  pull,
}
