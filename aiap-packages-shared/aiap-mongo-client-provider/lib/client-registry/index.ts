/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-mongo-client-provider-client-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AiapMongoClientV1,
} from '../client';

const REGISTRY: {
  [key: string]: AiapMongoClientV1,
} = {};

const addOneToRegistryById = (
  id: string,
  client: AiapMongoClientV1,
) => {
  try {
    if (
      lodash.isEmpty(id)
    ) {
      const ERROR_MESSAGE = 'Missing required id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !client
    ) {
      const ERROR_MESSAGE = 'Missing required client parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    REGISTRY[id] = client;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addOneToRegistryByIdAndHash = (
  client: AiapMongoClientV1,
) => {
  try {
    if (
      !client
    ) {
      const MESSAGE = 'Missing required client parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ID = client?.id;
    const HASH = client?.hash;

    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = 'Missing required client.id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(HASH)
    ) {
      const MESSAGE = 'Missing required client.hash parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    addOneToRegistryById(`${ID}:${HASH}`, client);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addOneToRegistryByName = (
  client: AiapMongoClientV1,
) => {
  try {
    if (
      !client
    ) {
      const MESSAGE = 'Missing required client parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    const NAME = ramda.path(['name'], client);
    if (
      lodash.isEmpty(NAME)
    ) {
      const MESSAGE = 'Missing required client.name parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    addOneToRegistryById(NAME, client);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addManyToRegistryByIdAndHash = (
  clients: Array<AiapMongoClientV1>,
) => {
  try {
    if (
      !clients
    ) {
      const MESSAGE = 'Missing required clients parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    for (const CLIENT of clients) {
      addOneToRegistryByIdAndHash(CLIENT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addManyToRegistryByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addManyToRegistryByName = (
  clients: Array<AiapMongoClientV1>,
) => {
  try {
    if (
      !clients
    ) {
      const MESSAGE = 'Missing required clients parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    for (const CLIENT of clients) {
      addOneToRegistryByName(CLIENT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addManyToRegistryByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const closeConnections = async () => {
  try {
    const PROMISES = [];
    for (const [key, value] of Object.entries(REGISTRY)) {
      logger.info(`Closing aca-mongo-client connection ${key}!`);
      if (
        value
      ) {
        PROMISES.push(value.close());
      }
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addManyToRegistryByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getOneById = (
  id: string,
): AiapMongoClientV1 => {
  try {
    if (
      lodash.isEmpty(id)
    ) {
      const MESSAGE = 'Missing required id parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
    }
    const RET_VAL = REGISTRY[id];
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getOneByIdAndHash = (
  id: string,
  hash: string,
): AiapMongoClientV1 => {
  try {
    if (
      lodash.isEmpty(id)
    ) {
      const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
    }
    if (
      lodash.isEmpty(hash)
    ) {
      const MESSAGE = 'Missing hash required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { hash });
    }
    const RET_VAL = getOneById(`${id}:${hash}`);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getOneByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getRegistry = () => {
  return REGISTRY;
}

const touchOneByIdAndHash = (
  params: {
    id: string,
    hash: string,
  }
) => {
  try {
    const CLIENT = getOneByIdAndHash(params?.id, params?.hash);
    const RET_VAL = !lodash.isEmpty(CLIENT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(touchOneByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  addOneToRegistryById,
  addOneToRegistryByIdAndHash,
  addOneToRegistryByName,
  addManyToRegistryByIdAndHash,
  addManyToRegistryByName,
  closeConnections,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
  touchOneByIdAndHash,
}
