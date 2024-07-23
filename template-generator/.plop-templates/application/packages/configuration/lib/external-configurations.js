/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const PATH_TO_CONFIGURATION = '/lib/configuration';
const EXTERNAL_LIBRARIES_LIST = [
  '@ibm-aiap/aiap-passport-provider',
  '@ibm-aiap/aiap-mongo-client-provider',
  '@ibm-aiap/aiap-redis-client-provider',
  '@ibm-aiap/aiap-memory-store-provider',
  '@ibm-aiap/aiap-app-datasource-provider',
  '@ibm-aiap/aiap-tenants-cache-provider',
  '@ibm-aiap/aiap-tenants-resources-loader',
  '@ibm-aiap/aiap-jwt-provider',
  '@ibm-aiap/aiap-event-stream-provider',
  '@ibm-aiap/aiap-main-event-stream-handler',
  '@ibm-aiap/aiap-app-service',
];

const attachEternalLibsSchemas = (schema) => {
  for (let externalLibrary of EXTERNAL_LIBRARIES_LIST) {
    console.log(externalLibrary);
    let externalConfiguration = require(`${externalLibrary}${PATH_TO_CONFIGURATION}`);
    schema = externalConfiguration.Configurator.attachToJoiSchema(schema);
  }
  return schema;
}

const loadExternalLibsConfiguration = async (rootConfiguration, rawConfiguration, configurationProvider) => {
  const PROMISES = [];
  for (let externalLibrary of EXTERNAL_LIBRARIES_LIST) {
    let externalConfiguration = require(`${externalLibrary}${PATH_TO_CONFIGURATION}`);
    externalConfiguration.Configurator.loadConfiguration(rootConfiguration, rawConfiguration, configurationProvider);
    PROMISES.push(externalConfiguration.Configurator.loadConfiguration(rootConfiguration, rawConfiguration, configurationProvider));
  }

  await Promise.all(PROMISES);
}


module.exports = {
  attachEternalLibsSchemas,
  loadExternalLibsConfiguration,
}
