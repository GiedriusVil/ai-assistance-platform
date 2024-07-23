/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenant-event-stream-handler-live-analytics-queries-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AIAP_EVENT_TYPE,
  getEventStreamByTenant,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  QueryDeleteEventHandler,
  QuerySaveEventHandler,
} from './lib';

export const subscribe = async (
  params: {
    tenant?: ITenantV1,
  } = {},
) => {
  try {
    const TENANT = params?.tenant;
    const EVENT_STREAM = getEventStreamByTenant(TENANT);
    if (
      lodash.isEmpty(EVENT_STREAM)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve aca-event-stream!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
    }
    await EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.SAVE_LIVE_ANALYTICS_QUERY, QuerySaveEventHandler(TENANT));
    await EVENT_STREAM.subscribe(AIAP_EVENT_TYPE.DELETE_LIVE_ANALYTICS_QUERY, QueryDeleteEventHandler(TENANT));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(subscribe.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
