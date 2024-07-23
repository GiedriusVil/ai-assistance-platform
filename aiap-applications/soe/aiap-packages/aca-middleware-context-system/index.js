/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-context-system`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const setWorkspaceSystemContext = (update) => {
  update.session.aiService = ramda.assocPath(
    ['aiSkill', 'external', 'systemContext'],
    update.session.lastContext.system,
    update.session.aiService
  );
};

class ContextSystemWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'context-system-ware',
      middlewareTypes.INCOMING
    );
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      if (
        !update?.session?.aiService?.external.workspaceId ||
        !update?.session?.aiService?.aiSkill?.id
      ) {
        return;
      }
      setWorkspaceSystemContext(update, update?.session?.aiService?.aiSkill?.id, update?.session?.aiService?.external.workspaceId);
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
  ContextSystemWare,
};
