/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-rest-server-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  getEngagementsDatasourceByContext
} from '@ibm-aiap/aiap-engagements-datasource-provider';

import {
  aiapRestApiServerId
} from './lib/utils';

import {
  setConfigurationProvider, getLibConfiguration
} from './lib/configuration';

import {
  SERVER_ROUTES_REGISTRY
} from './lib/server-routes-registry';

import {
  AiapChatRestV1Server
} from './lib/server';

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
    app.use('/api/v1/voice', SERVER_ROUTES_REGISTRY);
    await initAiapChatRestServers(configurationProvider);
    logger.debug(`[${MODULE_ID}] - INITIALIZED`);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initAiapChatRestServers = async (configuration) => {
  let result;
  let resultsQty = 0;

  try {
    const CONFIGURATION = getLibConfiguration();
    const CONFIGURATION_SERVERS = CONFIGURATION?.servers;
    if (
      !lodash.isEmpty(CONFIGURATION_SERVERS) &&
      lodash.isArray(CONFIGURATION_SERVERS)
    ) {
      const PROMISES = [];
      for (let configurationServer of CONFIGURATION_SERVERS) {
        PROMISES.push(initAiapRestApiServer(configurationServer));
      }
      result = await Promise.all(PROMISES);
      resultsQty = result.length;
    }
    logger.info(`INITIALIZED ${resultsQty} servers!`);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { configuration })
    logger.error(initAiapChatRestServers.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initAiapRestApiServer = async (configuration) => {
  let restApiServer;
  try {
    const REST_API_SERVER_ID = aiapRestApiServerId(configuration);
    restApiServer = REGISTRY[REST_API_SERVER_ID];
    if (
      lodash.isEmpty(restApiServer)
    ) {
      restApiServer = new AiapChatRestV1Server(SERVER_ROUTES_REGISTRY, configuration);
      REGISTRY[REST_API_SERVER_ID] = restApiServer;
    } else {
      restApiServer.setConfiguration(configuration);
    }
    await restApiServer.initialise();
    const RET_VAL = restApiServer;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { configuration })
    logger.error(initAiapRestApiServer.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initOneByEngagement = async (context, params) => {
  const TENANT = context?.user?.session?.tenant;
  const TENANT_ID = TENANT?.id;
  const ENGAGEMENT = params?.engagement;
  const ENGAGEMENT_ID = ENGAGEMENT?.id;
  const ENGAGEMENT_ASSISTANT_ID = ENGAGEMENT?.assistant?.id;
  const ENGAGEMENT_CHAT_REST = ENGAGEMENT?.chatAppServer?.chatRestServer;
  let restApiServerConfiguration;
  try {
    if (
      ENGAGEMENT_CHAT_REST
    ) {
      restApiServerConfiguration = {
        tenant: {
          id: TENANT_ID,
        },
        engagement: {
          id: ENGAGEMENT_ID,
        },
        assistant: {
          id: ENGAGEMENT_ASSISTANT_ID,
        }
      };
      await initAiapRestApiServer(restApiServerConfiguration);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, ENGAGEMENT_ID, ENGAGEMENT_ASSISTANT_ID });
    logger.error(initOneByEngagement.name, ACA_ERROR)
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (params) => {
  const TENANT = params?.tenant;
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
      logger.debug(`Unable to initialize REST API server provider because engagement datasource was not found for tenant with id - ${TENANT?.id}`);
      return;
    }
    queryResponse = await DATASOURCE.engagements.findManyByQuery(CONTEXT, QUERY);
    engagements = queryResponse?.items;
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
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  initByConfigurationProvider,
  initManyByTenant,
  initOneByEngagement,
}
