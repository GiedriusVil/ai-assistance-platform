/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-dialog-count-outoing-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const { resetCounters } = require('./reset-counters');
const { isButton } = require('./is-button');

class DialogCountOutgoingWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'dialog-count-outgoing-ware',
      middlewareTypes.OUTGOING
    );
  }

  async executor(adapter, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      const dialog = ramda.path(['session', 'context', 'aca', 'dialog'], update);
      if (
        dialog &&
        !isButton(update, message)
      ) {
        if (update.session.context.aca.dialogs[dialog]) {
          update.session.context.aca.dialogs[dialog].count = update.session.context.aca.dialogs[dialog].count + 1;
        } else {
          update.session.context.aca.dialogs = ramda.mergeAll([
            update.session.context.aca.dialogs,
            { [dialog]: { count: 1 } },
          ]);
        }
        update.session.context.aca.dialogs = resetCounters(update.session.context.aca.dialogs, dialog);
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

module.exports = {
  DialogCountOutgoingWare,
};
