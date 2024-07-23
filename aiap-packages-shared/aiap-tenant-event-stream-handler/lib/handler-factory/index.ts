/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `tenant-event-stream-handler-factory`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  TenantEventStreamHandlerV1,
} from '../handler';

export const createAcaTenantEventStreamHandler = (
  tenant: ITenantV1,
) => {
  try {
    const RET_VAL = new TenantEventStreamHandlerV1(tenant);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createAcaTenantEventStreamHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
