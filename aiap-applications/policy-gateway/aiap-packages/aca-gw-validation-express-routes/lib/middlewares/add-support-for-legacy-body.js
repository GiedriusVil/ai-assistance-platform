/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-express-routes-middewares-add-support-for-legacy-body';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
} = require('@ibm-aca/aca-utils-errors');


const _sanitizeLegacyTenantStructure = (tenant) => {
  const RET_VAL = {};
  if (
    !lodash.isEmpty(tenant?.country)
  ) {
    RET_VAL.country = tenant?.country;
  }
  if (
    !lodash.isEmpty(tenant?.currency)
  ) {
    RET_VAL.currency = tenant?.currency;
  }
  if (
    !lodash.isEmpty(tenant?.language)
  ) {
    RET_VAL.language = tenant?.language;
  }
  if (
    !lodash.isEmpty(tenant?.id)
  ) {
    RET_VAL.external = {
      id: tenant?.id
    };
  }
  if (
    !lodash.isEmpty(tenant?.child)
  ) {
    RET_VAL.child = tenant?.child;
  }
  return RET_VAL;
}

const _addSupportForLegacyBody = async (request, response) => {
  try {
    if (
      lodash.isEmpty(request?.body?.context)
    ) {
      const BODY = {
        context: {},
        document: request?.body?.document,
      };
      if (
        !lodash.isEmpty(request?.body?.currencies)
      ) {
        BODY.context.currencies = request?.body?.currencies;
      }
      if (
        !lodash.isEmpty(request?.body?.tenant)
      ) {
        BODY.context.tenant = _sanitizeLegacyTenantStructure(request?.body?.tenant);
      }
      request.body = BODY;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_addSupportForLegacyBody.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const addSupportForLegacyBody = (request, response, next) => {
  try {
    _addSupportForLegacyBody(request, response)
      .then((response) => {
        next();
      }).catch((error) => {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        response.status(500).json({ errors: [ACA_ERROR] });
      });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addSupportForLegacyBody.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  addSupportForLegacyBody,
};
