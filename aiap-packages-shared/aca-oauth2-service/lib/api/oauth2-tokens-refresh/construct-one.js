/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-refresh-construct-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { uuidv4 } = require('@ibm-aca/aca-wrapper-uuid');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  TOKEN_REFRESH_STATUS,
} = require('../../utils');

const constructOne = (context, params) => {
  let date;
  let user;
  try {
    if (
      lodash.isEmpty(context?.user?.id)
    ) {
      const ERROR_MESSAGE = `Missing required context.user.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(context?.user?.name)
    ) {
      const ERROR_MESSAGE = `Missing required context.user.name attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(
        context?.user?.session?.tenant?.id
      )
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.tenant?.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isNumber(
        context?.user?.session?.tenant?.integration?.tokenRefresh?.expiryLengthMs
      ) &&
      !context?.user?.session?.tenant?.integration?.tokenRefresh?.expiryLengthMs > 0
    ) {
      const ERROR_MESSAGE = `Missing required context.user.session.tenant.integration.tokenRefresh.expiryLengthMs attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    date = new Date();
    user = {
      id: context?.user?.id,
      name: context?.user?.name,
    };
    const RET_VAL = {
      id: uuidv4(),
      expiryLengthMs: context?.user?.session?.tenant?.integration?.tokenRefresh?.expiryLengthMs,
      status: TOKEN_REFRESH_STATUS.CREATED,
      tenant: {
        id: context?.user?.session?.tenant?.id,
      },
      updated: { user, date },
      created: { user, date }
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  constructOne,
}
