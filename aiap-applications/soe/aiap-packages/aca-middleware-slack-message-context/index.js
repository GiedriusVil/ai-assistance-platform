/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-slack-tenant-hash-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

class SlackMessageContextWare extends AbstractMiddleware {
  constructor() {
    super([botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE],
      'slack-tenant-hash-ware',
      middlewareTypes.OUTGOING,
    )
  }

  async executor(update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (update.channel === 'SLACK') {
        message.context = update.session.context;
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID })
      logger.error('executor', { ACA_ERROR });
      return;
    }
  }
}

module.exports = {
  SlackMessageContextWare,
};
