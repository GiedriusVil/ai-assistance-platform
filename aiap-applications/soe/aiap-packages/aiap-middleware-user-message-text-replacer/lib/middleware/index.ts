/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-user-message-text-chars-replace`;
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
  getUpdateSenderId,
  setUpdateRawMessageText,
  getUpdateRawMessageText,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

class UserMessageTextReplacerWare extends AbstractMiddleware {

  charArray: Array<{
    from: any,
    to: any,
  }>;

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
      ],
      'character-converter-ware',
      middlewareTypes.INCOMING
    );
    this.charArray = [
      {
        from: /á|à|ä|à|ã/gi,
        to: 'a',
      },
      {
        from: /é|è|ë|è/gi,
        to: 'e',
      },
      {
        from: /í|ì|ï|ì/gi,
        to: 'i',
      },
      {
        from: /ó|ò|ö|ò|õ/gi,
        to: 'o',
      },
      {
        from: /ú|ù|ü|ù/gi,
        to: 'u',
      },
      {
        from: /ç/gi,
        to: 'c',
      },
    ];
  }

  async executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    const UPDATE_MESSAGE_TEXT = getUpdateRawMessageText(update);
    let updateMessageTextLowerCase;
    try {
      if (
        !lodash.isEmpty(UPDATE_MESSAGE_TEXT)
      ) {
        updateMessageTextLowerCase = UPDATE_MESSAGE_TEXT.toLowerCase();
        for (let i = 0; i < this.charArray.length; i++) {

          const CHAR_FROM = this.charArray[i].from;
          const CHAR_TO = this.charArray[i].to;

          updateMessageTextLowerCase = updateMessageTextLowerCase.replace(CHAR_FROM, CHAR_TO);
        }
        setUpdateRawMessageText(update, updateMessageTextLowerCase);
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }

  }
}

export {
  UserMessageTextReplacerWare,
}
