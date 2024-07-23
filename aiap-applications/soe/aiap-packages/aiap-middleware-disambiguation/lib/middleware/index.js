/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-disambiguation`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const { getLibConfiguration } = require('../configuration');

class DisambiguationWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
      ],
      'disambiguation-ware',
      middlewareTypes.INCOMING
    );
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);

    let configuration;

    try {
      configuration = getLibConfiguration();

      const intentsToQuestions = (intents) => {
        const firstIntent = configuration.intents[intents[0].intent];
        const secondIntent = configuration.intents[intents[1].intent];
        update.session.context = update.session.oldContext;
        update.response = update.response || {};

        update.response.text = `${configuration.selectIntentMessage}<button title="${firstIntent.title ||
          firstIntent.content}">${firstIntent.content}</button> <button title="${secondIntent.title ||
          secondIntent.content}">${secondIntent.content}</button>`;
      };

      if (
        configuration &&
        update.session[update.session.dialogType || 'wva'].intents.length > 0
      ) {
        const diff = function (a, b) {
          return b.confidence - a.confidence;
        };
        const filter = intent => intent.confidence > configuration.minConfidence;

        const filteredIntents = ramda.sort(
          diff,
          ramda.filter(filter, update.session[update.session.dialogType || 'wva'].intents)
        );
        if (
          filteredIntents.length > 0 &&
          filteredIntents[0].confidence > configuration.maxConfidence
        ) {
          return;
        } else if (
          filteredIntents.length === 0
        ) {
          return;
        } else if (
          filteredIntents.length >= 2 &&
          filteredIntents[0].confidence - filteredIntents[1].confidence < configuration.maxDifference
        ) {
          logger.debug('Filtered intents: ', { filteredIntents }, { update });
          const topIntents = ramda.slice(0, 2, ramda.sort(diff, filteredIntents));
          logger.info('[dialog-ambiguity-found]', { topIntents, update });
          if (
            configuration.intents[topIntents[0].intent] &&
            configuration.intents[topIntents[1].intent]
          ) {
            logger.info('[dialog-ambiguity-initiated]', { topIntents, update });
            intentsToQuestions(topIntents);
            return;
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        return;
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error(this.executor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  DisambiguationWare,
};
