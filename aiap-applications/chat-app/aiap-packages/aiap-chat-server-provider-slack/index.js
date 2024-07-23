/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-slack-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getEngagementsDatasourceByContext } = require('@ibm-aiap/aiap-engagements-datasource-provider');

const { setConfigurationProvider, getLibConfiguration } = require('./lib/configuration');
const { acaSlackServerId } = require('./lib/utils');

const { SERVER_ROUTES_REGISTRY } = require('./lib/server-routes-registry');
const { AcaSlackServer } = require('./lib/server-provider');

const REGISTRY = {};

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configuration provider parameter! [aca-common-config, aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    app.use('/api/slack-server/v1', SERVER_ROUTES_REGISTRY);
    await initAcaSlackServers();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initByConfigurationProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initAcaSlackServers = async () => {
  let result;
  let resultsQty = 0;
  try {
    const CONFIGURATION_SERVERS = ramda.path(['servers'], getLibConfiguration());
    if (
      !lodash.isEmpty(CONFIGURATION_SERVERS) &&
      lodash.isArray(CONFIGURATION_SERVERS)
    ) {
      const PROMISES = [];
      for (let configurationServer of CONFIGURATION_SERVERS) {
        PROMISES.push(initAcaSlackServer(configurationServer));
      }
      result = await Promise.all(PROMISES);
      resultsQty = result.length;
    }
    logger.info(`INITIALIZED ${resultsQty} servers!`);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initAcaSlackServers', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initAcaSlackServer = async (configuration) => {
  let acaSlackServer;
  try {
    const ACA_SLACK_SERVER_ID = acaSlackServerId(configuration);
    acaSlackServer = REGISTRY[ACA_SLACK_SERVER_ID];
    if (
      lodash.isEmpty(acaSlackServer)
    ) {
      acaSlackServer = new AcaSlackServer(SERVER_ROUTES_REGISTRY, configuration);
      REGISTRY[ACA_SLACK_SERVER_ID] = acaSlackServer;
    } else {
      acaSlackServer.setConfiguration(configuration);
    }
    await acaSlackServer.initialise();
    const RET_VAL = acaSlackServer;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { configuration })
    logger.error('initAcaSlackServer', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initOneByEngagement = async (context, params) => {
  const USER_ID = ramda.path(['user', 'id'], context);
  const TENANT = ramda.path(['user', 'session', 'tenant'], context);
  const TENANT_ID = ramda.path(['id'], TENANT);
  const ENGAGEMENT = ramda.path(['engagement'], params);
  const ENGAGEMENT_ID = ramda.path(['id'], ENGAGEMENT);
  const ENGAGEMENT_ASSISTANT_ID = ramda.path(['assistant', 'id'], ENGAGEMENT);
  const ENGAGEMENT_SLACK = ramda.path(['slack'], ENGAGEMENT);
  let acaSlackServerConfiguration;
  try {
    if (
      !lodash.isEmpty(ENGAGEMENT_SLACK)
    ) {
      acaSlackServerConfiguration = {
        tenant: {
          id: TENANT_ID,
        },
        engagement: {
          id: ENGAGEMENT_ID,
        },
        assistant: {
          id: ENGAGEMENT_ASSISTANT_ID,
        },
        external: ENGAGEMENT_SLACK,
      };
      await initAcaSlackServer(acaSlackServerConfiguration);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, ENGAGEMENT_ID, ENGAGEMENT_ASSISTANT_ID });
    logger.error('initOneByParams', ACA_ERROR)
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (params) => {
  const TENANT = ramda.path(['tenant'], params);
  const CONTEXT = {
    user: {
      id: 'system',
      session: {
        tenant: TENANT
      }
    }
  }
  const QUERY = {
    sort: {
      field: 'id',
      direction: 'asc'
    },
    pagination: {
      page: 0,
      size: 1000
    }
  };
  let queryResponse;
  let engagements;
  try {
    const DATASOURCE = getEngagementsDatasourceByContext(CONTEXT);
    if (lodash.isEmpty(DATASOURCE?.engagements)) {
      logger.debug(`Unable to initialize slack server provider because engagement datasource was not found for tenant with id - ${TENANT?.id}`);
      return;
    }
    queryResponse = await DATASOURCE.engagements.findManyByQuery(CONTEXT, QUERY);
    engagements = ramda.path(['items'], queryResponse);
    const PROMISES = [];
    if (
      lodash.isArray(engagements) &&
      !lodash.isEmpty(engagements)
    ) {
      for (let engagement of engagements) {
        PROMISES.push(initOneByEngagement(CONTEXT, { engagement }))
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initManyByTenant', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  initOneByEngagement,
}
