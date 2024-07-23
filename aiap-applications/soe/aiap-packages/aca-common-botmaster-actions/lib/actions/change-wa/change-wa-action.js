/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('change-wa-action');
const actionService = require('./service');
const changeWA = stateStore => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: function(params) {
    const { attributes, update, bot, before } = params;
    const { message, name, service, clientMessage, internalMessage, skill } = attributes;
    const {
      message: { text: userInput },
    } = update;
    const messageToSend = message || userInput;

    if (before.trim()) bot.reply(update, before);
    let handover;
    if (clientMessage && internalMessage && skill) {
      handover = `${clientMessage}<handover skill="${skill}">${internalMessage}</handover>`;
    }
    actionService.setWCSData(update, name, service, update.waSkillRef, handover);

    stateStore
      .setData(update.sender.id, update.session)
      .then(() => {
        bot.sendUpdate(update, messageToSend);
      })
      .catch(err =>
        logger.error('[ACTIONS][CHANGE-WA][ERROR] Unable to store changeWA data in the session', { update, err })
      );
  },
});

module.exports = changeWA;
