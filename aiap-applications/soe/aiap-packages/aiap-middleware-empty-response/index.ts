/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-empty-response`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  getUpdateSenderId,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

class EmptyResponseWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'empty-response-incoming-ware',
      middlewareTypes.INCOMING
    );
  }

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      const RESPONSE: string = ramda.pathOr('', ['response'], update);
      if (lodash.isEmpty(RESPONSE)) {
        update.response.text = 'Empty message to be sent out. Something is wrong with the conversation.';
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  EmptyResponseWare,
};
