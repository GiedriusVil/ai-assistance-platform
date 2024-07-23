/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-event-stream-handler-tenant-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  onTenantDeleteEvent,
} from './lib/on-tenant-delete-event';

import {
  onTenantSaveEvent,
} from './lib/on-tenant-save-event';

export const subscribe = async (
  params = {},
) => {
  try {
    const MAIN_EVENT_STREAM = getEventStreamMain();
    if (
      lodash.isEmpty(MAIN_EVENT_STREAM)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve main-aca-event-stream!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }
    await MAIN_EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.SAVE_TENANT, onTenantSaveEvent);
    await MAIN_EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.DELETE_TENANT, onTenantDeleteEvent);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(subscribe.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
