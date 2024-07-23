/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { increment, setRetries, viewRetries } = require('./utils');

const RetryTag = () => ({
  replace: 'before',
  series: true,
  evaluate: 'step',
  controller: function ({ before, bot, update }) {
    update.session.retry = true;
    let retryCount = viewRetries(['context', 'aca', 'retry_count'], update.session);
    retryCount = increment(retryCount);
    update.session = setRetries(['context', 'aca', 'retry_count'], update.session, retryCount);
    bot.reply(update, before);
  },
});

module.exports = {
  RetryTag
};
