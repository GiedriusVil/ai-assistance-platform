/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-express-routes-middewares-append-context-to-request';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} = require('@ibm-aca/aca-utils-errors');

const { decode, ACA_CODEC_DECODE_TYPES } = require('@ibm-aca/aca-utils-codec');

const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');

const { getAcaValidationEngagementsDatasourceByContext } = require('@ibm-aca/aca-validation-engagements-datasource-provider');

const _retrieveUserFromAuthorizationHeader = (request) => {
  let retVal = {
    id: 'ANONYMOUS_USER_ID',
    username: 'ANONYMOUS_USER_NAME',
  };
  let headerAuthorization;
  let credentialsEncoded;
  let credentialsDecoded;
  let credentials;
  try {
    headerAuthorization = request?.headers?.authorization;
    if (
      !lodash.isEmpty(headerAuthorization)
    ) {
      credentialsEncoded = headerAuthorization.replace('Basic ', '');
      try {
        credentialsDecoded = decode({
          type: ACA_CODEC_DECODE_TYPES.BASE64_2_STRING,
          input: credentialsEncoded,
        });
        if (
          !lodash.isEmpty(credentialsDecoded)
        ) {
          credentials = credentialsDecoded.split(':');
        }
        if (
          lodash.isArray(credentials) &&
          !lodash.isEmpty(credentials)
        ) {
          retVal.id = credentials[0];
          retVal.username = credentials[0];
        }
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(_retrieveUserFromAuthorizationHeader.name, { ACA_ERROR });
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveUserFromAuthorizationHeader.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const _appendContextToRequest = async (request, response) => {
  let tenantExternalId;
  let tenant;
  let user;
  let userId;
  let engagementKey;
  let engagement;
  let currencies;
  let context;
  try {
    tenantExternalId = request?.body?.context?.tenant?.external?.id;
    engagementKey = request?.body?.context?.engagement?.key;
    currencies = request?.body?.context?.currencies;
    user = _retrieveUserFromAuthorizationHeader(request);
    userId = user?.id;
    if (
      lodash.isEmpty(tenantExternalId)
    ) {
      const MESSAGE = `Missing required request.body.context.tenant.external.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANTS_CACHE = getTenantsCacheProvider();
    if (
      lodash.isEmpty(TENANTS_CACHE)
    ) {
      const MESSAGE = `Unable retrieve AcaTenantCacheProvider!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    tenant = await TENANTS_CACHE.tenants.findOneByExternalId({ externalId: tenantExternalId });
    if (
      lodash.isEmpty(tenant?.id)
    ) {
      const MESSAGE = `Unable retrieve tenant from cache!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    tenant = ramda.mergeDeepRight(tenant, request?.body?.context?.tenant || {});
    user.session = { tenant, currencies };
    context = { user };
    if (
      !lodash.isEmpty(engagementKey)
    ) {
      const DATASOURCE_ENGAGEMENTS = getAcaValidationEngagementsDatasourceByContext(context);
      engagement = await DATASOURCE_ENGAGEMENTS
        .validationEngagements.findOneByKey(context, { key: engagementKey });
      context.user.session.engagement = engagement;
    }
    request.context = context;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { tenantExternalId, engagementKey, userId });
    logger.error(_appendContextToRequest.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const appendContextToRequestMidleware = (request, response, next) => {
  try {
    _appendContextToRequest(request, response)
      .then((response) => {
        next();
      }).catch((error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        response.status(500).json({ errors: [ACA_ERROR] });
      });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendContextToRequestMidleware.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  appendContextToRequestMidleware,
};
