/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-botmaster-actions-wiki';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

// const st = require('striptags');

const wiki = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    logger.info(wiki.name, { configuration });
    // await rp(`${config.wiki.url}${attributes.message}`)
    //   .then(resp => {
    //     if (logger.isDebug()) logger.debug(`[ACTIONS][WIKI] Response: ${resp}`, { update });
    //     let res = JSON.parse(st(resp));
    //     const title = R.path(['query', 'search', 0, 'title'], res);
    //     const snippet = R.path(['query', 'search', 0, 'snippet'], res);
    //     if (title && snippet) {
    //       let reply = `${title} ${snippet}`;
    //       if (snippet.startsWith(title)) {
    //         reply = snippet;
    //       }
    //       logger.info(`[ACTIONS][WIKI] WIKI replied with: ${reply}`, { trace: update });
    //       bot.reply(update, `${before ? before : ''}${reply}${after ? after : ''}`);
    //     } else {
    //       bot.reply(update, `${attributes.fallback ? attributes.fallback : config.wiki.fallback}`);
    //     }
    //   })
    //   .catch(err => {
    //     logger.error(`[ACTIONS][WIKI][ERROR] WIKI failure`, { update, err });
    //     bot.reply(update, `${attributes.fallback ? attributes.fallback : config.wiki.fallback}`);
    //   });
  },
});

module.exports = {
  wiki,
};
