/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
  getLibConfiguration,
} from './lib/configuration';

import {
  IDatasourceAppV1,
} from './lib/types';

import {
  DatasourceAppV1Mongo,
} from './lib/datasource-mongo';

const REGISTRY: {
  [key: string]: IDatasourceAppV1,
} = {};

const DATASOURCE_TYPE = {
  MONGO: 'mongo',
  POSTGRESQL: 'postgres'
}

const _initDatasourceAppV1Mongo = async (
  configuration: any,
) => {
  const NAME = configuration?.name;
  const DATASOURCE = new DatasourceAppV1Mongo(configuration);
  await DATASOURCE.initialize();
  REGISTRY[NAME] = DATASOURCE;
  return DATASOURCE;
}

const initDatasource = async (
  configuration: any,
) => {
  try {
    let retVal;
    const TYPE = configuration?.type;
    const MESSAGE_UNKNOWN_DATASOURCE_TYPE = `Unable initialize unknown type of app-datasource!`;
    switch (TYPE) {
      case DATASOURCE_TYPE.MONGO:
        retVal = await _initDatasourceAppV1Mongo(configuration);
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE_UNKNOWN_DATASOURCE_TYPE, { TYPE });
        break;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initDatasources = async (
  configuration: {
    sources: Array<any>,
  },
) => {
  try {
    const SOURCES = configuration?.sources;
    if (
      !lodash.isEmpty(SOURCES) &&
      lodash.isArray(SOURCES)
    ) {
      const PROMISES = [];
      for (const SOURCE of SOURCES) {
        PROMISES.push(initDatasource(SOURCE));
      }
      const RESULTS = await Promise.all(PROMISES);
      logger.info(`${initDatasources.name} - SUCCESS`,
        {
          datasources: RESULTS.map(item => {
            const RET_VAL = {
              name: item.configuration.name,
              type: item.configuration.type,
              client: item.configuration.client,
            };
            return RET_VAL;
          }),
        });
    } else {
      logger.warn(`${initDatasources.name} - WARN - Missing configuration!`);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initDatasources.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    const PROVIDER_CONFIG = getLibConfiguration()
    if (PROVIDER_CONFIG) {
      const RET_VAL = await initDatasources(PROVIDER_CONFIG);
      return RET_VAL;
    } else {
      logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}

const getDatasourceV1App = (
  name = 'default'
): IDatasourceAppV1 => {
  const RET_VAL = REGISTRY[name];
  return RET_VAL;
}

export {
  initByConfigurationProvider,
  getDatasourceV1App,
}
