/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'main-event-stream-handler-on-tenant-delete-event';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

export const onTenantDeleteEvent = async (
  data: any,
  channel: any,
) => {
  logger.info(onTenantDeleteEvent.name, { data, channel });
}
