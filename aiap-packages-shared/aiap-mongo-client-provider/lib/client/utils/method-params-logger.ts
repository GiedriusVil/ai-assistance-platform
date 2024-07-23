/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-mongo-client-provider-client-utils-method-params-logger`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';
import { getLibConfiguration } from '../../configuration';

/** 
 * Configuration is under 'aca-mongo-client-provider' section
 * Default value is 'false'
 * @example MONGO_CLIENTS_PROVIDER_METHOD_PARAMS_LOGGER_ENABLED = true || false
*/
const logMethodParams = (
  methodName,
  context,
  params,
) => {
  try {
    const IS_METHOD_PARAMS_LOGGER_ENABLED = getLibConfiguration()?.methodParamsLoggerEnabled;
    if (
      IS_METHOD_PARAMS_LOGGER_ENABLED
    ) {
      const CONTEXT_PARAMS = {
        user: {
          id: context?.user?.id,
        },
        tenant: {
          id: context?.user?.session?.tenant?.id,
          hash: context?.user?.session?.tenant?.hash,
        },
      };
      const METHOD_PARAMS = {
        context: CONTEXT_PARAMS,
        params: params,
      };
      logger.info(`[${methodName}] `, METHOD_PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

export {
  logMethodParams,
}
