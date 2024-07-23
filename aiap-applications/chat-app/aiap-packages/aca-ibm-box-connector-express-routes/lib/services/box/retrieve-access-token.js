/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-ibm-box-connector-express-routes-services-box-service-retrieve-access-token`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const retrieveAccessToken = async (context, params) => {
  let clientUrl;
  let clientId;
  let clientSecret;
  let clientRefreshToken;
  let response;
  try {
    clientUrl = params?.clientUrl;
    clientId = params?.clientId;
    clientSecret = params?.clientSecret;
    clientRefreshToken = params?.clientRefreshToken;
    const POST_REQUEST_OPTIONS = {
      url: clientUrl,
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: clientRefreshToken,
        grant_type: 'refresh_token',
      },
    };
    response = await execHttpPostRequest({}, POST_REQUEST_OPTIONS);
    const RET_VAL = {
      timestamp: response?.body?.timestamp,
      expires: response?.body?.expires_in,
      accessToken: response?.body?.access_token,
      refreshTokenNext: response?.body?.refresh_token,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAccessToken, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveAccessToken,
}
