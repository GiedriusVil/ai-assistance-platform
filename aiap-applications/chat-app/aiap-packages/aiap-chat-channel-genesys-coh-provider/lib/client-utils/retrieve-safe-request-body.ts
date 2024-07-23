/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-utils-retrieve-safe-request-body';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const retrieveSafeRequestBody = (
  request: {
    body: any,
  },
) => {
  let retVal;
  try {
    if (
      lodash.isString(request?.body)
    ) {
      retVal = JSON.parse(request?.body);
    } else if (
      lodash.isObject(request?.body)
    ) {
      retVal = request?.body;
    } else {
      retVal = request?.body;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveSafeRequestBody.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  retrieveSafeRequestBody,
}
