/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-box-connector-express-routes-lib-box-controller-refresh-credentials';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { retrieveConnector, setBoxCredentials } = require('../../utils');
const { boxService } = require('../../services');

const refreshCredentials = async (request, response) => {
  const ERRORS = [];
  let refreshToken;
  let connectorId;
  let connector;

  let boxCredentials;

  let result = {};
  try {
    refreshToken = request?.body?.refreshToken;
    connectorId = request?.body?.connectorId;
    if (
      lodash.isEmpty(connectorId)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.connectorId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(refreshToken)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.refreshToken parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    connector = retrieveConnector({ connectorId });
    if (
      lodash.isEmpty(connector)
    ) {
      const ERROR_MESSAGE = `Unnable to retrieve connector configuration! [connectorId: ${connectorId}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    boxCredentials = await boxService.retrieveAccessToken({}, {
      clientUrl: connector?.clientUrl,
      clientId: connector?.clientId,
      clientSecret: connector?.clientSecret,
      clientRefreshToken: refreshToken,
    });
    boxCredentials.refreshTokenCurrent = refreshToken;

    await setBoxCredentials({ connectorId, boxCredentials });
    result.success = true;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(MODULE_ID, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  refreshCredentials,
};
