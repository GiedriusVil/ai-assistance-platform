/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-resources-loader-reload-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app'

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getMemoryStore,
} from '@ibm-aiap/aiap-memory-store-provider';

import {
  getLibConfiguration,
} from './configuration'

const initResources = async (
  params: {
    options?: {
      silent?: boolean,
    }
  },
) => {
  const LIB_CONFIGURATION = getLibConfiguration();
  const CONFIGURATION_RESOURCES = LIB_CONFIGURATION?.resources;
  if (
    lodash.isArray(CONFIGURATION_RESOURCES) &&
    !lodash.isEmpty(CONFIGURATION_RESOURCES)
  ) {
    let index = 0;
    for (const CONFIGURATION_RESOURCE of CONFIGURATION_RESOURCES) {
      try {
        const RESOURCE_NAME = CONFIGURATION_RESOURCE?.name;
        const RESOURCE_METHOD = CONFIGURATION_RESOURCE?.method;

        if (
          lodash.isEmpty(RESOURCE_NAME)
        ) {
          const ERROR_MESSAGE = `Missing required configuration.resources[${index}].name value!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        if (
          lodash.isEmpty(RESOURCE_METHOD)
        ) {
          const ERROR_MESSAGE = `Missing required configuration.resources[${index}].method value!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        const RESOURCE = require(RESOURCE_NAME);
        if (
          lodash.isEmpty(RESOURCE)
        ) {
          const ERROR_MESSAGE = `Missing resource[name: ${RESOURCE_NAME}] library in the runtime!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        const method = RESOURCE[RESOURCE_METHOD];
        if (
          !lodash.isFunction(method)
        ) {
          const ERROR_MESSAGE = `Missing resource[name: ${RESOURCE_NAME}] library method -> ${RESOURCE_METHOD} in the runtime!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
        }
        await method(params);
        index++;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { params });
        ACA_ERROR.data = { CONFIGURATION_RESOURCE };
        logger.error(initResources.name, { ACA_ERROR });

        if (
          !params?.options?.silent
        ) {
          throw ACA_ERROR;
        }
      }
    }
  }
}

const _reloadOne = async (
  tenant: ITenantV1,
) => {
  let libConfiguration;
  try {
    libConfiguration = getLibConfiguration();
    const PARAMS = {
      tenant,
      options: {
        silent: true,
      },
    };
    await initResources(PARAMS);
    const MEMORY_STORE = getMemoryStore();
    await MEMORY_STORE.set(`TENANTS:${tenant.id}:${tenant.hash}`, tenant);
    if (
      libConfiguration?.indexByExternalId
    ) {
      const TENANT_EXTERNAL_ID = tenant?.external?.id;
      if (
        !lodash.isEmpty(TENANT_EXTERNAL_ID)
      ) {
        await MEMORY_STORE.set(`TENANTS_BY_EXTERNAL_ID:${TENANT_EXTERNAL_ID}`, tenant);
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    const DATA = ramda.pathOr({}, ['data'], ACA_ERROR);
    DATA.tenantId = tenant.id;
    DATA.tenantHash = tenant.hash;
    ACA_ERROR.data = DATA;
    logger.error(_reloadOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const reloadOne = async (
  tenant: ITenantV1,
) => {
  const ID = tenant?.id;
  const HASH = tenant?.hash;
  if (
    !lodash.isEmpty(ID) &&
    !lodash.isEmpty(HASH)
  ) {
    await _reloadOne(tenant);
  } else {
    logger.warn(`Skipping tenant reload into catch`, { ID, HASH });
  }

}

