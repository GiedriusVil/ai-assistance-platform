/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-voice-agent-message-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId,
} = require('@ibm-aiap/aiap-utils-soe-update');

class VoiceAgentMessageWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'voice-agent-message-ware',
      middlewareTypes.OUTGOING
    );
  }

  async executor(bot, update, message) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    try {
      const attachment = {
        intents: update?.session?.aiService?.intents,
        entities: update?.session?.aiService?.entities,
        input: {
          text: update.message.text,
        },
        output: {
          text: [update.message.text],
          nodes_visited: update.session.aiService.aiSkill.external.nodes_visited,
        },
        context: update.session.context,
      };
      message.message.attachment = { type: 'voiceAgent', payload: attachment };
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
  VoiceAgentMessageWare,
};
