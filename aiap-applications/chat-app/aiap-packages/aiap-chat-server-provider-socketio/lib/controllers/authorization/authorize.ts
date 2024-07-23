/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-socketio-controllers-authorization-authorize';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { authorizationService } from '@ibm-aiap/aiap-authorization-service';
import { getTokenService } from '@ibm-aiap/aiap-token-service';

import {
  retrieveStoredSession,
  storeSession,
} from '@ibm-aca/aca-utils-session';

const _authorizeByGAcaProps = async (params: any) => {
  let gAcaProps;
  try {
    gAcaProps = params?.gAcaProps;
    if (
      lodash.isEmpty(gAcaProps?.tenantId)
    ) {
      const MESSAGE = 'Missing required gAcaProps.tenantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(gAcaProps?.assistantId)
    ) {
      const MESSAGE = 'Missing required gAcaProps.assistantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(gAcaProps?.engagementId)
    ) {
      const MESSAGE = 'Missing required gAcaProps.engagementId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = { gAcaProps };
    const RET_VAL = await authorizationService.authorize(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_authorizeByGAcaProps.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const authorize = async (request: any, response: any) => {
  const ERRORS = [];
  let requestBody;
  let gAcaProps;
  let jwtTokenEncoded;
  let identificationStatus;

  let result;
  try {
    requestBody = request?.body;
    gAcaProps = requestBody?.gAcaProps;
    jwtTokenEncoded = requestBody?.token;
    identificationStatus = gAcaProps?.identificationStatus;

    if (
      lodash.isEmpty(jwtTokenEncoded)
    ) {
      result = await _authorizeByGAcaProps({ gAcaProps });
    } else {
      const TOKEN_SERVICE = getTokenService();
      const JWT_TOKEN_DECODED = TOKEN_SERVICE.verify(jwtTokenEncoded);
      result = await retrieveStoredSession(JWT_TOKEN_DECODED);
      const SESSION_G_ACA_PROPS = result?.gAcaProps
      if (
        !lodash.isEmpty(jwtTokenEncoded) &&
        !lodash.isEmpty(result) &&
        !lodash.isEmpty(SESSION_G_ACA_PROPS)
      ) {
        result.gAcaProps.identificationStatus = identificationStatus;
        await storeSession(result);
      }
      if (
        lodash.isEmpty(result)
      ) {
        result = await _authorizeByGAcaProps({ gAcaProps });
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    return response.status(200).json(result);
  } else {
    logger.error(authorize.name, { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }
}

export {
  authorize,
}
