/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-event-stream-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AIAP_EVENT_TYPE,
  EventStreamV1,
  IEventStreamConfigurationV1,
} from './lib/types';

import {
  getConfiguration,
  setConfigurationProvider,
  Configurator,
} from './lib/configuration';

import {
  createEventStreams,
} from './lib/factory';

import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
} from './lib/registry';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (
  path = DEFAULT_CONFIG_PATH,
) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      const MESSAGE = `Missing ${DEFAULT_CONFIG_PATH} configuration`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const CONFIG_CLIENTS = CONFIG_PROVIDER?.streams;
    const CLIENTS = await createEventStreams(CONFIG_CLIENTS);
    addManyToRegistryByName(CLIENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider: any,
  path = DEFAULT_CONFIG_PATH,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Please provide configuration provider! [aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    await initManyByRootConfiguration(path);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initByConfigurationProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (
  params: {
    tenant: {
      eventStreams: any
    },
  }
) => {
  const TENANT = params?.tenant;
  try {
    const CONFIG_CLIENTS = TENANT?.eventStreams;
    if (
      !lodash.isEmpty(CONFIG_CLIENTS)
    ) {
      const CLIENTS = await createEventStreams(CONFIG_CLIENTS);
      await addManyToRegistryByIdAndHash(CLIENTS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getEventStreamByContext = (
  context: {
    user?: {
      session?: {
        tenant?: any,
      }
    }
  }
) => {
  const TENANT = context?.user?.session?.tenant;
  if (
    lodash.isEmpty(TENANT)
  ) {
    const MESSAGE = 'Missing required context.user.session.tenant attribute!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const RET_VAL = getEventStreamByTenant(TENANT);
  return RET_VAL;
}

const getEventStreamByTenant = (
  tenant: {
    eventStreams?: Array<any>,
  }
) => {
  const CONFIG_EVENT_STREAM = ramda.path(['eventStreams', 0], tenant);

  const CONFIG_EVENT_STREAM_ID = ramda.path(['id'], CONFIG_EVENT_STREAM);
  const CONFIG_EVENT_STREAM_HASH = ramda.path(['hash'], CONFIG_EVENT_STREAM);

  const RET_VAL = getEventStreamByIdAndHash(CONFIG_EVENT_STREAM_ID, CONFIG_EVENT_STREAM_HASH);
  return RET_VAL;
}

const getEventStreamByIdAndHash = (
  id = 'default',
  hash = undefined,
) => {
  let retVal;
  if (
    !lodash.isEmpty(id) &&
    !lodash.isEmpty(hash)
  ) {
    retVal = getOneByIdAndHash(id, hash);
  } else if (
    !lodash.isEmpty(id)
  ) {
    retVal = getOneById(id);
  }
  return retVal;
};

const getEventStreams = () => {
  return getRegistry();
}

const getEventStreamMain = (): EventStreamV1<IEventStreamConfigurationV1> => {
  const EVENT_STREAM_ID = 'main';
  const RET_VAL = getEventStreamByIdAndHash(EVENT_STREAM_ID);
  return RET_VAL;
}

const getEventStreamChatApp = (): EventStreamV1<IEventStreamConfigurationV1> => {
  const EVENT_STREAM_ID = 'chat-app';
  const RET_VAL = getEventStreamByIdAndHash(EVENT_STREAM_ID);
  return RET_VAL;
}

export {
  AIAP_EVENT_TYPE,
  //
  EventStreamV1,
  IEventStreamConfigurationV1,
  //
  initByConfigurationProvider,
  initManyByTenant,
  //
  getEventStreamByContext,
  getEventStreamByTenant,
  getEventStreamByIdAndHash,
  getEventStreams,
  //
  getEventStreamMain,
  getEventStreamChatApp,
  //
}
