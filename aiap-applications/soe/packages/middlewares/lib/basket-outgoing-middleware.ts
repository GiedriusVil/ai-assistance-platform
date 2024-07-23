/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-basket-outgoing-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  getUpdateSessionContextAttribute,
} from '../../../aiap-packages/aiap-utils-soe-update';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

class BasketOutgoingMiddleware extends AbstractMiddleware {

  configuration: any;

  constructor(configuration: any) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'basket-outgoing-middleware',
      middlewareTypes.OUTGOING,
    );
    this.configuration = configuration;
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      return true;
    }

    return false;
  }

  async executor(bot, update, message) {
    try {
      const BASKET = getUpdateSessionContextAttribute(update, 'basket');
      message.basket = BASKET;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
    }
  }

}

export {
  BasketOutgoingMiddleware,
}
