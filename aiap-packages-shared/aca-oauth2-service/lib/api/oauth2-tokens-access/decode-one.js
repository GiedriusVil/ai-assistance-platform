/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-access-decode-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { jwt } = require('@ibm-aca/aca-wrapper-jsonwebtoken');

const decodeOne = (context, params) => {
  let retVal;
  try {
    if (
      lodash.isEmpty(params?.tokenEncoded)
    ) {
      const ERROR_MESSAGE = `Missing required params?.token attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(
        context?.user?.session?.tenant?.integration?.tokenAccess?.secret
      )
    ) {
      const ERROR_MESSAGE = `Missing required context?.user?.session?.tenant?.integration?.tokenAccess?.secret attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    retVal = jwt.verify(
      params?.tokenEncoded,
      context?.user?.session?.tenant?.integration?.tokenAccess?.secret
    );
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(decodeOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  decodeOne,
}
