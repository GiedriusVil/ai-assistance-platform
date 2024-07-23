/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-construct-retry-options';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1WaV1,
} from '.';

const _appendProcessEnvOptions = (
  options: {
    retries?: number,
    factor?: number,
    minTimeout?: number,
    maxTimeout?: number,
    randomize?: boolean,
  }
) => {
  if (
    !lodash.isEmpty(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_RETRIES)
  ) {
    options.retries = parseInt(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRIES);
  } else {
    options.retries = 5;
  }
  if (
    !lodash.isEmpty(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_FACTOR)
  ) {
    options.factor = parseInt(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_FACTOR);
  } else {
    options.factor = 2;
  }
  if (
    !lodash.isEmpty(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_MIN_TIMEOUT)
  ) {
    options.minTimeout = parseInt(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_MIN_TIMEOUT);
  } else {
    options.minTimeout = 500;
  }
  if (
    !lodash.isEmpty(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_MAX_TIMEOUT)
  ) {
    options.maxTimeout = parseInt(process?.env?.AIAP_AI_SERVICE_CLIENT_WA_V1_ASSYNC_RETRY_MAX_TIMEOUT);
  } else {
    options.maxTimeout = Number.POSITIVE_INFINITY;
  }
  options.randomize = true;
}

const asyncRetryOptions = (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
) => {
  try {
    const RET_VAL = {};
    _appendProcessEnvOptions(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(asyncRetryOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  asyncRetryOptions,
}
