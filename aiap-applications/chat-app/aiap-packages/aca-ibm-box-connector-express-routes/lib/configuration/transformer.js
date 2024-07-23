/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const _connector = (flatConnector) => {
  const RET_VAL = {
    id: flatConnector?.id,
    clientId: flatConnector?.clientId,
    clientSecret: flatConnector?.clientSecret,
    clientUrl: flatConnector?.clientUrl,
  }
  return RET_VAL;
}

const _connectors = (flatConnectors) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatConnectors) &&
    lodash.isArray(flatConnectors)
  ) {
    for (let flatConnector of flatConnectors) {
      if (
        !lodash.isEmpty(flatConnector)
      ) {
        RET_VAL.push(_connector(flatConnector));
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CONNECTORS_FLAT = provider.getKeys(
    'IBM_BOX_CONNECTOR',
    [
      'ID',
      'CLIENT_ID',
      'CLIENT_SECRET',
      'CLIENT_URL',
    ]
  );
  const CONNECTORS = _connectors(CONNECTORS_FLAT);
  const RET_VAL = provider.isEnabled('IBM_BOX_CONNECTOR_EXPRESS_ROUTES_ENABLED', false, {
    connectors: CONNECTORS
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
