/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-brain-error-handler';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  sendErrorMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getLibConfiguration,
} from '../configuration';

const errorHandler = (
  error?: any,
) => {
  try {
    const LIB_CONFIGURATION = getLibConfiguration();

    const RET_VAL = async (
      adapter: SoeBotV1,
      error: any,
      update: ISoeUpdateV1,
    ) => {
      const G_ACA_PROPS = update?.raw?.gAcaProps;
      const language = update?.raw?.gAcaProps.isoLang;

      let errorMessage = LIB_CONFIGURATION?.error?.defaultMessage;

      const ERROR_MESSAGE_OVERRIDE = update?.raw?.engagement?.soe?.botFatalErrorMessage?.[language];
      if (
        !lodash.isEmpty(ERROR_MESSAGE_OVERRIDE)
      ) {
        errorMessage = ERROR_MESSAGE_OVERRIDE;
      }
      const ON_ERROR_MESSAGE = `[ERROR_MESSAGE] ${MODULE_ID} -> ${errorMessage}`;
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);

      appendDataToError(ACA_ERROR,
        {
          gAcaProps: G_ACA_PROPS,
        });

      await sendErrorMessage(adapter, update, ON_ERROR_MESSAGE, ACA_ERROR);
      logger.fatal('[ENGINE][ERROR] Generic brain error', { error, update });
      adapter.reply(update, errorMessage);
    };
    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(errorHandler.name, { error, ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  errorHandler,
}
