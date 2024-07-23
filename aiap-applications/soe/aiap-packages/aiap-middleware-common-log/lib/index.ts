/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-common-log`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import { formatIntoAcaError, appendDataToError, } from '@ibm-aca/aca-utils-errors';
import { AbstractMiddleware, botStates, middlewareTypes } from '@ibm-aiap/aiap-soe-brain';
import { getUpdateSenderId } from '@ibm-aiap/aiap-utils-soe-update';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';
import { ISoeUpdateV1} from '@ibm-aiap/aiap--types-soe';

class CommonLogWare extends AbstractMiddleware {

  private path: string;
  private message: string;

  constructor(message, path) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'common-log-ware',
      middlewareTypes.INCOMING
    );
    this.message = message;
    this.path = path;
  }

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {

      if (
        logger.isDebug()
      ) {
        logger.debug(this.message, { update });
      }

      const obj = this.path ?
        ramda.path(ramda.split('.', this.path), update) :
        this.path === '' ?
          update :
          {};

      logger.info(`${this.message}`, { data: obj, path: this.path, trace: update });

      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID })
      logger.error(`executor`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  CommonLogWare,
};
