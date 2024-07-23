/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-authorization-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  storeSession,
  newConversationId,
  refreshToken,
  getSessionFromToken,
} = require('@ibm-aca/aca-utils-session');

const {
  retrieveTenant,
  retrieveEngagement,
  customizeEngagement,
  retrieveAudioVoiceServices
} = require('./lib');

const _authorize = async (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'Authentication service is not implemented. Please implement it using lambda module.',
    { params }
  );
}

const _ensureSessionExistance = (params) => {
  const G_ACA_PROPS = params?.gAcaProps;

  const SESSION = params?.session
  const SESSION_CONVERSATION_ID = params?.session?.conversation?.id;
  if (
    lodash.isEmpty(SESSION)
  ) {
    params.session = {};
  }

  if (
    lodash.isEmpty(SESSION_CONVERSATION_ID)
  ) {
    params.session.conversation = {
      id: newConversationId(),
    }
  }

  params.session.gAcaProps = G_ACA_PROPS;
}

const authorize = async (params) => {
  let jwtTokenEncoded;
  let gAcaProps;

  let tenant;
  let tenantId;
  let tenantHash;

  try {
    gAcaProps = params?.gAcaProps;
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const ERROR_MESSAGE = `Missing required params.gAcaProps parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }

    jwtTokenEncoded = params?.token;

    tenant = await retrieveTenant(params);
    tenantId = tenant?.id;
    tenantHash = tenant?.hash;

    if (
      lodash.isEmpty(tenantId)
    ) {
      const ERROR_MESSAGE = `Unable retrieve tenant.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }
    if (
      lodash.isEmpty(tenantHash)
    ) {
      const ERROR_MESSAGE = `Missing retrieve tenant.hash!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }

    gAcaProps.tenantHash = tenantHash;

    const SESSION_FROM_JWT_TOKEN = getSessionFromToken(jwtTokenEncoded);

    const TENANT_LITE = {
      id: tenantId,
      hash: tenantHash,
    }
    const PARAMS = {
      tenant: tenant,
      lambdaModule: {
        id: MODULE_ID
      },
      session: SESSION_FROM_JWT_TOKEN
    };
    _ensureSessionExistance(PARAMS);

    PARAMS.session.tenant = TENANT_LITE;
    PARAMS.session.engagement = await retrieveEngagement(gAcaProps, tenant);
    PARAMS.session.gAcaProps = gAcaProps;

    PARAMS.session.engagement.audioVoiceServices = await retrieveAudioVoiceServices(tenant, PARAMS);

    const CONTEXT = {
      user: {
        ...PARAMS,
      }
    };

    await executeEnrichedByLambdaModule(MODULE_ID, _authorize, CONTEXT, PARAMS);

    PARAMS.session.engagement = await customizeEngagement(CONTEXT, PARAMS);
    refreshToken(PARAMS);
    await storeSession(PARAMS.session);
    const RET_VAL = PARAMS.session;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(authorize.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

let authorizationService = {
  authorize,
}

module.exports = {
  authorizationService,
}
