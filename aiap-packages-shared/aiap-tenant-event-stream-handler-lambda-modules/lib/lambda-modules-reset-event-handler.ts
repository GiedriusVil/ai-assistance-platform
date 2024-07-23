/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-event-stream-handler-on-lambda-modules-reset-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const onLambdaModulesResetEvent = async (
  data: any,
  channel: any,
) => {
  try {
    logger.info(`${onLambdaModulesResetEvent.name}-handler`, { data, channel });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${onLambdaModulesResetEvent.name}-handler`, { ACA_ERROR });
  }

}
