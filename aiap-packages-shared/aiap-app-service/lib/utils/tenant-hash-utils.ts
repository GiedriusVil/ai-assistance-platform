/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-utils-tenant-hash-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  calcHash,
  removeHashField
} from '@ibm-aiap/aiap-utils-hash';

const _calculateHashForRedisClient = (
  client: any,
) => {
  if (
    !lodash.isEmpty(client)
  ) {
    removeHashField(client);
    client.hash = calcHash(client);
  }
}

const _calculateHashForRedisClients = (
  tenant: ITenantV1,
) => {
  if (
    lodash.isArray(tenant?.redisClients) &&
    !lodash.isEmpty(tenant?.redisClients)
  ) {
    for (const CLIENT of tenant.redisClients) {
      _calculateHashForRedisClient(CLIENT);
    }
  }
}

const _calculateHashForDBClient = (
  client: any,
) => {
  if (
    !lodash.isEmpty(client)
  ) {
    removeHashField(client);
    client.hash = calcHash(client);
  }
}

const _calculateHashForDBClients = (
  tenant: ITenantV1,
) => {
  if (
    !lodash.isEmpty(tenant?.dbClients)
  ) {
    for (const CLIENT of tenant.dbClients) {
      _calculateHashForDBClient(CLIENT);
    }
  }
}

const _calculateHashForDatasource = (
  datasource: any,
) => {
  if (
    !lodash.isEmpty(datasource)
  ) {
    removeHashField(datasource);
    datasource.hash = calcHash(datasource);
  }
}

const _retrieveDBClientHash = (
  tenant: ITenantV1,
  datasource: {
    client: Array<any>,
  },
) => {
  let retVal;
  if (
    lodash.isString(datasource?.client) &&
    !lodash.isEmpty(datasource?.client) &&
    !lodash.isEmpty(tenant?.dbClients)
  ) {
    const INDEX = lodash.findIndex(tenant?.dbClients, { id: datasource?.client });
    if (
      INDEX >= 0
    ) {
      const DB_CLIENT = tenant.dbClients[INDEX];
      if (
        lodash.isObject(DB_CLIENT) &&
        !lodash.isEmpty(DB_CLIENT)
      ) {
        retVal = DB_CLIENT.hash;
      }
    }
  }
  return retVal;
}

const _calculateHashForDatasources = (
  tenant: ITenantV1,
) => {
  if (
    lodash.isArray(tenant?._datasources) &&
    !lodash.isEmpty(tenant?._datasources)
  ) {
    for (const DATASOURCE of tenant._datasources) {
      DATASOURCE.clientHash = _retrieveDBClientHash(tenant, DATASOURCE);
      _calculateHashForDatasource(DATASOURCE);
    }
  }
}

const _calculateHashForEventStream = (
  stream: any,
) => {
  if (
    !lodash.isEmpty(stream)
  ) {
    removeHashField(stream);
    stream.hash = calcHash(stream);
  }
}

const _retrieveRedisClientEmitterHash = (
  tenant: ITenantV1,
  stream: {
    clientEmitter: any,
  },
) => {
  let retVal;
  if (
    lodash.isString(stream?.clientEmitter) &&
    !lodash.isEmpty(stream?.clientEmitter) &&
    !lodash.isEmpty(tenant?.redisClients)
  ) {
    const INDEX = lodash.findIndex(tenant.redisClients, { id: stream?.clientEmitter });
    if (
      INDEX >= 0
    ) {
      const CLIENT = tenant.redisClients[INDEX];
      if (
        lodash.isObject(CLIENT) &&
        !lodash.isEmpty(CLIENT)
      ) {
        retVal = CLIENT.hash;
      }
    }
  }
  return retVal;
}

const _retrieveRedisClientReceiverHash = (
  tenant: ITenantV1,
  stream: {
    clientReceiver: any,
  },
) => {
  let retVal;
  if (
    lodash.isString(stream?.clientReceiver) &&
    !lodash.isEmpty(stream?.clientReceiver) &&
    !lodash.isEmpty(tenant?.redisClients)
  ) {
    const INDEX = lodash.findIndex(tenant.redisClients, { id: stream?.clientReceiver });
    if (
      INDEX >= 0
    ) {
      const CLIENT = tenant.redisClients[INDEX];
      if (
        lodash.isObject(CLIENT) &&
        !lodash.isEmpty(CLIENT)
      ) {
        retVal = CLIENT.hash;
      }
    }
  }
  return retVal;
}

const _calculateHashForEventStreams = (
  tenant: ITenantV1,
) => {
  if (
    lodash.isArray(tenant?.eventStreams) &&
    !lodash.isEmpty(tenant?.eventStreams)
  ) {
    for (const STREAM of tenant.eventStreams) {

      STREAM.clientEmitterHash = _retrieveRedisClientEmitterHash(tenant, STREAM);
      STREAM.clientReceiverHash = _retrieveRedisClientReceiverHash(tenant, STREAM);

      _calculateHashForEventStream(STREAM);
    }
  }
}

const _calculateHashForObjectStorage = (
  tenant: ITenantV1,
) => {
  if (
    !lodash.isEmpty(tenant?.objectStorage)
  ) {
    tenant.objectStorage.hash = calcHash(tenant?.objectStorage);
  }
}

export const calculateHashForOne = (
  tenant: ITenantV1,
) => {
  if (
    !lodash.isEmpty(tenant)
  ) {
    _calculateHashForRedisClients(tenant);
    _calculateHashForDBClients(tenant);
    _calculateHashForDatasources(tenant);
    _calculateHashForEventStreams(tenant);
    _calculateHashForObjectStorage(tenant);
    removeHashField(tenant);

    // QUICK IDEA - for skipping CREATE/UPDATE details in hash calculation!
    const TMP_TENANT = lodash.cloneDeep(tenant);
    delete TMP_TENANT.created;
    delete TMP_TENANT.updated;

    tenant.hash = calcHash(TMP_TENANT);
  }
  return tenant;
}
