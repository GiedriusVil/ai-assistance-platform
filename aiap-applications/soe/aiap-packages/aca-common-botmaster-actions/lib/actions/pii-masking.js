/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-botmaster-actions-actions-pii-masking'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const PIIMasking = () => ({
  controller: ({ bot, attributes, update }) => {
    if (bot.implements && bot.implements.clientSideMasking && bot.useEngagements && attributes.stage) {
      switch (attributes.stage) {
        case 'secModeOn':
          setTimeout(
            () =>
              bot.sendMaskingMessage({
                senderId: update.sender.id,
                secMode: 'ma-on',
              }),
            2000
          );
          return `<!--MA-ON--><!--TOK:${update.sender.id}-->`;
        case 'maskPin':
          update.session.pinMasked = true;
          break;
        case 'secModeOff':
          return '<!--MA-OFF-->';
        default:
          logger.warn('masking was requested with unsupported stage attribute');
      }
    } else {
      logger.warn('masking was requested without stage or for unsupported platform');
    }
    return '';
  },
});

module.exports = {
  PIIMasking,
};
