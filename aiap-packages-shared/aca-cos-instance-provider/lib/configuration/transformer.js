/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const cosInstances = (flatClients) => {
  const RET_VAL = [];
  if (!lodash.isEmpty(flatClients)) {
    for (let flatClient of flatClients) {
      if (!lodash.isEmpty(flatClient)) {
        RET_VAL.push(cosInstance(flatClient));
      }
    }
  }
  return RET_VAL;
}

const cosInstance = (flatClient) => {
  const RET_VAL = {
    name: ramda.path(['name'], flatClient),
    options: {
      id: ramda.path(['id'], flatClient),
      region: ramda.path(['region'], flatClient),
      apiKey: ramda.path(['apiKey'], flatClient),
      endpoint: ramda.path(['endpoint'], flatClient),
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const INSTANCES_FLAT = provider.getKeys(
        'COS_INSTANCE_PROVIDER',
        [
          'NAME',
          'ID',
          'REGION',
          'API_KEY',
          'ENDPOINT',
        ]
    );
    const COS_INSTANCES = cosInstances(INSTANCES_FLAT);
    const RET_VAL = provider.isEnabled('COS_INSTANCE_PROVIDER_ENABLED', false, {
      instances: COS_INSTANCES
    });
    return RET_VAL;
}

module.exports = {
  transformRawConfiguration
}
