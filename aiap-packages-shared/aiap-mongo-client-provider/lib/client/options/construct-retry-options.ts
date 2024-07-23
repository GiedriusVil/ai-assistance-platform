/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-mongo-client-provider-client-construct-retry-options`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AiapMongoClientV1,
} from '..';

const _appendProcessEnvOptions = (
  options: any,
) => {
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_RETRIES)
  ) {
    options.retries = parseInt(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_RETRIES);
  } else {
    options.retries = 3;
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_FACTOR)
  ) {
    options.factor = parseInt(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_FACTOR);
  } else {
    options.factor = 2;
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_MIN_TIMEOUT)
  ) {
    options.minTimeout = parseInt(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_MIN_TIMEOUT);
  } else {
    options.minTimeout = 500;
  }
  if (
    !lodash.isEmpty(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_MAX_TIMEOUT)
  ) {
    options.maxTimeout = parseInt(process?.env?.ACA_MONGO_CLIENT_ASYNC_RETRY_MAX_TIMEOUT);
  } else {
    options.maxTimeout = Number.POSITIVE_INFINITY;
  }
  options.randomize = true;
}

const _onRetry = (
  client: AiapMongoClientV1,
  context: {
    user?: {
      id?: string,
    }
  },
  params: any,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const RET_VAL = async (error, attempt) => {
    try {
      delete params.throw;
      delete client.db;
    } catch (err) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, err);
      appendDataToError(ACA_ERROR, {
        CONTEXT_USER_ID: CONTEXT_USER_ID,
        params: params,
        error: error,
        attempt: attempt
      });
      logger.error(_onRetry.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  return RET_VAL;
}

const constructRetryOptions = (
  client: AiapMongoClientV1,
  context: any,
  params: any,
) => {
  try {
    const RET_VAL =
    {
      onRetry: _onRetry(client, context, params)
    };
    _appendProcessEnvOptions(RET_VAL);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructRetryOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  constructRetryOptions,
}
