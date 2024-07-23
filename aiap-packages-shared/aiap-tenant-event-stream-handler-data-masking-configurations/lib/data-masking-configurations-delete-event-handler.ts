/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenant-event-stream-handler-on-data-masking-configurations-delete-event';
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
  dataMaskingRegistry,
} from '@ibm-aca/aca-data-masking-provider';

export const DataMaskingConfigurationsDeleteEventHandler = (
  tenant: ITenantV1,
) => {
  try {
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Missing required tenant parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const HANDLER = async (
      data: any,
      channel: any,
    ) => {
      try {
        const TENANT_ID = tenant?.id;
        const CONFIGURATION_KEY = data?.key;
        dataMaskingRegistry.deleteOneFromRegistry(TENANT_ID, CONFIGURATION_KEY);
        logger.info(`SUCCESS`, {
          maskingConfiguration: {
            key: CONFIGURATION_KEY,
            tenantId: TENANT_ID,
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
    logger.error(DataMaskingConfigurationsDeleteEventHandler.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
