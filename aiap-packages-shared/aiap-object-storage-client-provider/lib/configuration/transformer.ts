/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const objectStorage = (
  flatClient: any
) => {
  const RET_VAL = {
    name: flatClient.name,
    type: flatClient.type,
    endPoint: flatClient.endPoint,
    port: flatClient.port,
    accessKey: flatClient.accessKey,
    secretKey: flatClient.secretKey,
  }
  return RET_VAL;
}

const client = (
  flatClient: any
) => {
  let retVal;
  if (
    !lodash.isEmpty(flatClient)
  ) {
    retVal = objectStorage(flatClient);
  }
  return retVal;
}

const objectStorageClients = (
  flatClients: Array<any>
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatClients) &&
    lodash.isArray(flatClients)
  ) {
    for (const FLAT_CLIENT of flatClients) {
      const TMP_FLAT_CLIENT = client(FLAT_CLIENT)
      if (
        !lodash.isEmpty(TMP_FLAT_CLIENT)
      ) {
        RET_VAL.push(TMP_FLAT_CLIENT);
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'REDIS_CLIENT_PROVIDER',
    [
      'NAME',
      'TYPE',
      'ENDPOINT',
      'PORT',
      'ACCESS_KEY',
      'SECRET_KEY',
    ]
  );
  const CLIENTS = objectStorageClients(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('OBJECT_STORAGE_CLIENT_PROVIDER_ENABLED', false, {
    clients: CLIENTS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
