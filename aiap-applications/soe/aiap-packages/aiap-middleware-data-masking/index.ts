/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-data-masking`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  getUpdateGAcaProps,
  getUpdateRawMessageText,
  setUpdateRawMessageText,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  dataMaskingService,
} from '@ibm-aca/aca-data-masking-provider';

class DataMaskingWare extends AbstractMiddleware {

  configuration: any;

  constructor(configuration) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'data-masking-ware',
      middlewareTypes.INCOMING
    );
    this.configuration = configuration || {};
  }

  __shouldSkip(
    params: {
      update: ISoeUpdateV1,
    },
  ) {
    const PARAMS = {
      update: params?.update,
      skipSenderActionTypes: [],
    };
    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);
    let retVal = false;
    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      retVal = true;
    }
    return retVal;
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    const UPDATE_G_ACA_PROPS = getUpdateGAcaProps(update);
    const UPDATE_G_ACA_PROPS_TENANT_ID = UPDATE_G_ACA_PROPS?.tenantId;
    const UPDATE_MESSAGE_TEXT = getUpdateRawMessageText(update);
    try {
      const DISABLED_MASKING_BY_TENANT_ARRAY = dataMaskingService.getDisabledTenantIds();
      const OPTIONS = {
        tenantId: UPDATE_G_ACA_PROPS_TENANT_ID,
      };
      if (
        DISABLED_MASKING_BY_TENANT_ARRAY.includes(UPDATE_G_ACA_PROPS_TENANT_ID)
      ) {
        return;
      } else {
        const UPDATE_MESSAGE_TEXT_NEW = dataMaskingService.mask(
          UPDATE_MESSAGE_TEXT,
          OPTIONS
        );

        if (
          UPDATE_MESSAGE_TEXT !== UPDATE_MESSAGE_TEXT_NEW
        ) {
          logger.info('[MASKING] Data been masked', {
            UPDATE_MESSAGE_TEXT,
            UPDATE_MESSAGE_TEXT_NEW,
            trace: update,
          });
        }
        setUpdateRawMessageText(update, UPDATE_MESSAGE_TEXT_NEW);
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  DataMaskingWare,
}
