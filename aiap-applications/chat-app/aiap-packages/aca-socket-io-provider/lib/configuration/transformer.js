/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('lodash');

const provider = (flatProvider) => {
  let retVal = {
    type: flatProvider.type,
    name: flatProvider.name,
    emitter: flatProvider.emitter,
    receiver: flatProvider.receiver,
  }
  return retVal;
}

const providers = (flatProvider) => {
  let retVal;
  if (
    !lodash.isEmpty(flatProvider)
  ) {
    retVal = provider(flatProvider);
  }
  return retVal;
}

const socketIOProviders = (flatProviders) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatProviders) && 
    lodash.isArray(flatProviders)
  ) {
    for(let flatProvider of flatProviders) {
      let tmpflatProvider = providers(flatProvider)
      if (
        !lodash.isEmpty(tmpflatProvider)
      ) {
          RET_VAL.push(tmpflatProvider);
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const PROVIDERS_FLAT = provider.getKeys(
        'SOCKET_IO_PROVIDER',
        [
          'NAME', 
          'TYPE', 
          'EMITTER',
          'RECEIVER'
        ]
    );
    const PROVIDERS = socketIOProviders(PROVIDERS_FLAT);

    const RET_VAL = provider.isEnabled('SOCKET_IO_PROVIDER_ENABLED', false, {
        SOCKET_IO_PROVIDERS: PROVIDERS
    });
    return RET_VAL;
}

module.exports = {
  transformRawConfiguration
}
