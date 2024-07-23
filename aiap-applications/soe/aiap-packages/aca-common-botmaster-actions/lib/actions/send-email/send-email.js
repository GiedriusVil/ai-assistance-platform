/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint-disable no-unused-vars */
const MODULE_ID = `aca-common-botmaster-actions-send-email`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

// const R = require('ramda');
// const { sendEmail } = require('./send-email-api-call');

const SendEmailAction = (config, sessionStore) => ({
  controller: (params) => {
    logger.info(SendEmailAction.name, { config, sessionStore });
    // // get values from tag
    // const subject = R.path(['subject'], attributes);
    // let to = R.path(['to'], attributes);
    // if (!to) to = config.mailServer.DEFAULT_EMAIL; //default to
    // const cc = R.path(['cc'], attributes);
    // const bcc = R.path(['bcc'], attributes);
    // const template = R.path(['template'], attributes);

    // // get template data from context
    // let templateLocals = R.path(['session', 'context', 'emailTemplateData'], update);

    // // add subject to template data
    // templateLocals ? (templateLocals.subject = subject) : (templateLocals = { subject: subject });

    // // create context email sent status
    // update.session.context.sendEmail = {};

    // //missing attr
    // if (!template || !to) {
    //   if (!template)
    //     logger.error('[ACTIONS][SEND-EMAIL] Missing "template" attribute in sendEmail tag', {
    //       update,
    //     });
    //   if (!to)
    //     logger.error('[ACTIONS][SEND-EMAIL] Missing "to" attribute in sendEmail tag', {
    //       update,
    //     });
    //   update.session.context.sendEmail.emailSent = false;
    //   sessionStore
    //     .setData(update.sender.id, update.session)
    //     .then(() => {
    //       bot.sendUpdate(update, ' ');
    //     })
    //     .catch(err => logger.error('[ACTIONS][SEND-EMAIL][ERROR] Save session failed', { update, err }));
    //   return '';
    // }

    // sendEmail(config.gatewayClient, update, {
    //   to: to,
    //   cc: cc,
    //   bcc: bcc,
    //   template: template,
    //   templateLocals: templateLocals,
    // })
    //   .then(res => {
    //     update.session.context.sendEmail.emailSent = true;

    //     sessionStore
    //       .setData(update.sender.id, update.session)
    //       .then(() => {
    //         bot.sendUpdate(update, ' ');
    //       })
    //       .catch(err => logger.error('[ACTIONS][SEND-EMAIL][ERROR] Save session failed', { update, err }));
    //   })
    //   .catch(err => {
    //     update.session.context.sendEmail.emailSent = false;
    //     logger.error('[ACTIONS][SEND-EMAIL][ERROR] Email was not sent', { update, err });

    //     sessionStore
    //       .setData(update.sender.id, update.session)
    //       .then(() => {
    //         bot.sendUpdate(update, ' ');
    //       })
    //       .catch(err => logger.error('[ACTIONS][SEND-EMAIL][ERROR] save session failed', { update, err }));
    //   });

    // return '';
  },
});

module.exports = {
  SendEmailAction,
};
