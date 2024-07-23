/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-ai-service-change-loop-handler-middleware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import { getLibConfiguration } from './configuration';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';
import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';


export class AiServiceChangeLoopHandlerWare extends AbstractMiddleware {

  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'ai-service-change-loop-handler-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    const CONFIGURATION = getLibConfiguration();

    const HANDLER_LIMIT = CONFIGURATION?.limit;
    const HANDLER_MESSAGE = CONFIGURATION?.message;

    let updateSenderId;
    let updateResponseText;

    let retVal;
    try {
      if (
        lodash.isEmpty(update?.sender?.id)
      ) {
        const ERROR_MESSAGE = `Missing require update?.sender?.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
      }

      updateSenderId = update?.sender?.id as string;
      updateResponseText = update?.response?.text;

      let counter = update?.session?.aca?.aiServiceChangeLoopHandlerCounter || 0;

      const HANDLER_REGEX = /changeWA/;

      const IS_AI_SERVICE_CHANGE = ramda.test(
        HANDLER_REGEX,
        updateResponseText
      );

      if (
        IS_AI_SERVICE_CHANGE && counter >= HANDLER_LIMIT
      ) {
        const OUTGOING_MESSAGE = bot.createOutgoingMessageFor(updateSenderId);

        OUTGOING_MESSAGE.addText(HANDLER_MESSAGE);
        await bot.sendMessage(OUTGOING_MESSAGE);

        retVal = 'cancel';
      } else if (
        IS_AI_SERVICE_CHANGE
      ) {
        counter++;
        lodash.set(
          update.session,
          'aca.aiServiceChangeLoopHandlerCounter',
          counter
        );
      } else {
        counter = 0;
        lodash.set(
          update.session,
          'aca.aiServiceChangeLoopHandlerCounter',
          counter
        );
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, {
        updateSenderId,
        updateResponseText,
        HANDLER_LIMIT,
        HANDLER_MESSAGE,
      });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}
