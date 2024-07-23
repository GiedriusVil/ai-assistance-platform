/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ibm-secrets-manager-client-provider-client-registry';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const REGISTRY = {};

const addOneToRegistryById = (id, client) => {
  try {
    if (lodash.isEmpty(id)) {
      const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
    }
    if (lodash.isEmpty(client)) {
      const MESSAGE = 'Missing client required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    REGISTRY[id] = client;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addOneToRegistryByIdAndHash = (client) => {
  try {
    if (lodash.isEmpty(client)) {
      const MESSAGE = 'Missing client required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    const ID = client?.id;
    const HASH = client?.hash;
    if (lodash.isEmpty(ID)) {
      const MESSAGE = 'Missing client.id required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    if (lodash.isEmpty(HASH)) {
      const MESSAGE = 'Missing client.hash required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    addOneToRegistryById(`${ID}:${HASH}`, client);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryByIdAndHash.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addOneToRegistryByName = (client) => {
  try {
    if (lodash.isEmpty(client)) {
      const MESSAGE = 'Missing client required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    const NAME = client?.name;
    if (lodash.isEmpty(NAME)) {
      const MESSAGE = 'Missing client.name required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { client });
    }
    addOneToRegistryById(NAME, client);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addOneToRegistryByName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const addManyToRegistryByIdAndHash = (clients) => {
  try {
    if (!lodash.isArray(clients)) {
      const MESSAGE = 'Wrong parameter($clients) type! [Expected Array]';
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

const addManyToRegistryByName = (clients) => {
  try {
    if (!lodash.isArray(clients)) {
      const MESSAGE = 'Wrong parameter($clients) type! [Expected Array]';
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

const getOneById = (id) => {
  try {
    if (lodash.isEmpty(id)) {
      const MESSAGE = 'Missing required id parameter! [EMPTY, NULL, UNDEFINED]';
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

const getOneByIdAndHash = (id, hash) => {
  try {
    if (lodash.isEmpty(id)) {
      const MESSAGE = 'Missing id required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { id });
    }
    if (lodash.isEmpty(hash)) {
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

export {
  addOneToRegistryById,
  addOneToRegistryByIdAndHash,
  addOneToRegistryByName,
  addManyToRegistryByIdAndHash,
  addManyToRegistryByName,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
}
