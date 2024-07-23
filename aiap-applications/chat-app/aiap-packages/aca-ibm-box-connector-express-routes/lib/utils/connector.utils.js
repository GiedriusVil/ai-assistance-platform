/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-box-connector-express-routes-utils-connector-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getLibConfiguration } = require('../configuration');

const retrieveConnector = (params) => {
  let configuration;
  let connectorId;
  let connectors;
  let connector;
  try {
    configuration = getLibConfiguration();
    connectors = configuration?.connectors;
    connectorId = params?.connectorId;
    if (
      lodash.isEmpty(connectorId)
    ) {
      const ERROR_MESSAGE = `Missing required params.connectorId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isEmpty(connectors) &&
      lodash.isArray(connectors)
    ) {
      connector = connectors.find((item) => {
        let retVal = false;
        if (
          item?.id === connectorId
        ) {
          retVal = true;
        }
        return retVal;
      });
    }
    return connector;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveConnector.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveConnector,
}
