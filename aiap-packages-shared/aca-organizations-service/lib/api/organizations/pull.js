/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-organizations-pull';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} = require('@ibm-aca/aca-utils-errors');

const { deepDifference } = require('@ibm-aca/aca-wrapper-obj-diff');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const {
  getAcaOrganizationsDatasourceByContext,
} = require('@ibm-aca/aca-organizations-datasource-provider');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const _retrievePullSourceTenant = async (context) => {
  const SOURCE_TENANT_ID = ramda.path(['user', 'session', 'tenant', 'pullTenant', 'id'], context);
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

const _retrievePullSourceOrganizations = async (context) => {
  const PULL_TENANT = await _retrievePullSourceTenant(context);
  if (
    lodash.isEmpty(PULL_TENANT)
  ) {
    const MESSAGE = `Unable to retrieve PULL_TENANT!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.BUSINESS_ERROR, MESSAGE);
  }
  const OVERRIDDEN_SESSION = lodash.cloneDeep(context);
  OVERRIDDEN_SESSION.user.session.tenant = PULL_TENANT;
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(OVERRIDDEN_SESSION);
  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.organizations.findManyByQuery(OVERRIDDEN_SESSION, PARAMS);
  const RET_VAL = ramda.path(['items'], RESPONSE);
  return RET_VAL;
}

const _retrieveCurrentOrganizations = async (context) => {
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.organizations.findManyByQuery(context, PARAMS);
  const RET_VAL = ramda.path(['items'], RESPONSE);
  return RET_VAL;
}

const _deployOrganization = async (context, params) => {
  const ORGANIZATION = ramda.path(['organization'], params);
  let retVal;
  if (
    !lodash.isEmpty(ORGANIZATION)
  ) {
    const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
    retVal = await DATASOURCE.organizations.saveOne(context, { organization: ORGANIZATION });
  }
  return retVal;
}

const _deployOrganizations = async (context, params) => {
  const ORGANIZATIONS = ramda.path(['organizations'], params);
  const PROMISES = [];
  if (
    !lodash.isEmpty(ORGANIZATIONS) &&
    lodash.isArray(ORGANIZATIONS)
  ) {
    for (let organization of ORGANIZATIONS) {
      PROMISES.push(_deployOrganization(context, { organization }));
    }
  }
  const RET_VAL = Promise.all(PROMISES);
  return RET_VAL;
}

const _pull = async (context, params) => {
  const ORGANIZATIONS_SOURCE = await _retrievePullSourceOrganizations(context);
  const ORGANIZATIONS_CURRENT = await _retrieveCurrentOrganizations(context);
  const ORGANIZATIONS_CHANGES = deepDifference({ organizations: ORGANIZATIONS_CURRENT }, { organizations: ORGANIZATIONS_SOURCE });
  const DATE = new Date();
  const ORGANIZATIONS_PULL_RELEASE = {
    created: DATE,
    createdT: DATE.getTime(),
    deployed: DATE,
    deployedT: DATE.getTime(),
    _as_is: ORGANIZATIONS_CURRENT,
    _to_be: ORGANIZATIONS_SOURCE,
    _changes: ORGANIZATIONS_CHANGES,
  };
  await _deployOrganizations(context, { organizations: ORGANIZATIONS_SOURCE });
  const DATASOURCE = getAcaOrganizationsDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.organizationsReleases.saveOne(context, { release: ORGANIZATIONS_PULL_RELEASE });
  const EVENT_STREAM = getEventStreamByContext(context);
  EVENT_STREAM.publish(AIAP_EVENT_TYPE.RESET_ENGINES, {});
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
