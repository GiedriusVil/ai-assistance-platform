/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-box-connector-express-routes-lib-controllers-box-get-token';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { boxService } = require('../../services');

const {
  retrieveConnector,
  getBoxCredentials,
  setBoxCredentials,
} = require('../../utils');

const EXPIRATION_THRESHOLD = 300;

const retrieveAccessToken = async (request, response) => {
  const ERRORS = [];
  let connectorId;
  let connector;
  let boxCredentials;
  let refreshTokenCurrent;
  let refreshTokenNext;
  let result = {};
  try {
    connectorId = request?.body?.connectorId;
    if (
      lodash.isEmpty(connectorId)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.connectorId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    connector = retrieveConnector({ connectorId });
    boxCredentials = await getBoxCredentials({ connectorId });
    if (
      lodash.isEmpty(boxCredentials?.refreshTokenNext)
    ) {
      const ERROR_MESSAGE = `Unnable to retrieve boxCredentials.refreshTokenNext! [connectorId: ${connectorId}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(boxCredentials?.refreshTokenCurrent)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve boxCredentials.refreshTokenCurrent! [connectorId: ${connectorId}]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    refreshTokenCurrent = boxCredentials?.refreshTokenCurrent;
    refreshTokenNext = boxCredentials?.refreshTokenNext;
    try {
      boxCredentials = await boxService.retrieveAccessToken({}, {
        clientUrl: connector?.clientUrl,
        clientId: connector?.clientId,
        clientSecret: connector?.clientSecret,
        clientRefreshToken: refreshTokenCurrent,
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { explanation: 'retrieveAccessToken - refreshTokenCurrent - can be invalid!' })
      logger.error(MODULE_ID, { ACA_ERROR });
      boxCredentials.expires = -1;
    }
    if (
      EXPIRATION_THRESHOLD >= boxCredentials?.expires
    ) {
      boxCredentials = await boxService.retrieveAccessToken({}, {
        clientUrl: connector?.clientUrl,
        clientId: connector?.clientId,
        clientSecret: connector?.clientSecret,
        clientRefreshToken: refreshTokenNext,
      });
      boxCredentials.refreshTokenCurrent = refreshTokenNext;
      await setBoxCredentials({ connectorId, boxCredentials });
    }
    result.boxCredentials = boxCredentials;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(retrieveAccessToken.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  retrieveAccessToken,
};
