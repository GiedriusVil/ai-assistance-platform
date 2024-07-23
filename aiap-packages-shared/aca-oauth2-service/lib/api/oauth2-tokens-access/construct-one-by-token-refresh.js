/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-access-construct-one-by-token-refresh';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { uuidv4 } = require('@ibm-aca/aca-wrapper-uuid');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  TOKEN_REFRESH_STATUS,
} = require('../../utils');

const constructOneByTokenRefresh = (context, params) => {
  let date;
  try {
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
        context?.user?.session?.tenant?.integration?.tokenAccess?.expiryLengthMs
      ) &&
      !context?.user?.session?.tenant?.integration?.tokenAccess?.expiryLengthMs > 0
    ) {
      const ERROR_MESSAGE = `Missing required context.user.session.tenant.integration.tokenAccess.expiryLengthMs attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.tokenRefresh?.created?.user)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tokenRefresh?.created?.user attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.tokenRefresh?.updated?.user)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tokenRefresh?.updated?.user attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    date = new Date();
    const RET_VAL = {
      id: uuidv4(),
      expiryLengthMs: context?.user?.session?.tenant?.integration?.tokenAccess?.expiryLengthMs,
      status: TOKEN_REFRESH_STATUS.CREATED,
      tenant: {
        id: context?.user?.session?.tenant?.id,
        integration: {
          tokenRefresh: {
            id: params?.tokenRefresh?.id,
          },
        }
      },
      updated: {
        user: params?.tokenRefresh?.updated?.user,
        date: date,
      },
      created: {
        user: params?.tokenRefresh?.created?.user,
        date: date,
      }
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructOneByTokenRefresh.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  constructOneByTokenRefresh,
}
