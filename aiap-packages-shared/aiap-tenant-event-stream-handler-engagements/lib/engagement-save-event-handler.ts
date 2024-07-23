/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenant-event-stream-handler-on-engagement-save-event';
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
  getAcaEngagementsCacheProvider,
} from '@ibm-aca/aca-engagements-cache-provider';

import {
  initOneByEngagement as initOneByEngagementSlackServer,
} from '@ibm-aiap/aiap-chat-server-provider-slack';

import {
  initOneByEngagement as initOneByEngagementChatRestServer,
} from '@ibm-aiap/aiap-chat-server-provider-rest-api';

export const EngagementSaveEventHandler = (
  tenant: ITenantV1,
) => {
  try {
    if (
      lodash.isEmpty(tenant)
    ) {
      const MESSAGE = `Missing required tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HANDLER = async (
      data: any,
      channel: any,
    ) => {
      try {
        const ENGAGEMENT_ID = data?.id;
        const TENANT_HASH = data?.tenant?.hash;
        const ENGAGEMENT_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
        await ENGAGEMENT_CACHE_PROVIDER.engagements.saveOne({
          engagement: data,
          tenant: tenant
        });
        const CONTEXT = {
          user: {
            id: 'system',
            session: {
              tenant: tenant,
            }
          }
        };
        const PARAMS = {
          engagement: data
        };
        await initOneByEngagementSlackServer(CONTEXT, PARAMS);
        await initOneByEngagementChatRestServer(CONTEXT, PARAMS);
        logger.info(`SUCCESS`, {
          engagement: {
            id: ENGAGEMENT_ID,
            tenantHash: TENANT_HASH
          },
          channel: channel
        });
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error)
        logger.error(`${MODULE_ID} -> HANDLER`, { ACA_ERROR });
      }
    };
    return HANDLER;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(EngagementSaveEventHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

