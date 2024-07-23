/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 *  Action to create a list of suggested entities
 */
const MODULE_ID = `aca-common-botmaster-actions-suggest-entities-suggest-entities`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const { FuseJS } = require('@ibm-aca/aca-wrapper-fuse-js');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const { Services } = require('./services');

var services = null;

const resultFunctionAsync = async (conversationCredentials) => {
  let entities;
  let spellchecker;
  try {
    entities = services.getEntities(conversationCredentials);
    spellchecker = services.spellcheckerPromise();
    const DEFAULT_ENITIES = ramda.compose(ramda.flatten, ramda.values)(entities);
    const getSpecifiedEntities = (specified) => {
      const RET_VAL = ramda.compose(ramda.flatten, ramda.props(specified))(entities);
      return RET_VAL;
    }
    const parseSpecifiedEntities = (contents) => {
      const RET_VAL = contents
        .replace(/@/g, '')
        .split(',')
        .map(e => e.trim());
      return RET_VAL;
    }
    const RET_VAL = (searchString, specifiedEntities, threshold) => {
      const FUSE_OPTIONS = { keys: ['entity'], includeScore: true, threshold };
      let fuse;
      if (specifiedEntities) {
        const entities = ramda.compose(
          ramda.reject(ramda.isNil),
          getSpecifiedEntities,
          parseSpecifiedEntities
        )(specifiedEntities);
        logger.debug(`using specified entities (${entities.length} entities)`);
        fuse = new FuseJS(entities, FUSE_OPTIONS);
      } else {
        fuse = new FuseJS(DEFAULT_ENITIES, FUSE_OPTIONS);
        logger.debug('entities not specified using default entities');
      }
      // find only words that are misspelled.
      const terms = searchString
        .split(' ')
        .filter(term => !spellchecker.check(term))
        .filter(term => term.length > 1);
      let results = [];
      terms.forEach(term => {
        results = results.concat(fuse.search(term));
      });
      const notPerfectResults = results.filter(a => a.score !== 0);
      const sortedResults = notPerfectResults.sort((a, b) => a.score - b.score);
      const slicedResults = sortedResults.slice(0, 10);
      return slicedResults.map(result => result.item.entity);
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('resultFunctionAsync', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


/**
 * Creates an action spec for suggestEntities
 * @param {Object} conversationCredentials username, password and workspaceId for conversation
 */
const SuggestEntities = (conversationCredentials, dictionary) => ({
  replace: 'before',
  controller: async ({ update, bot, content, attributes, before }) => {
    const RESPONSE_ON_NO_RESULTS = conversationCredentials.responseOnNoResults;
    const RESPONSE_ON_ERROR = conversationCredentials.responseOnError;
    try {
      const max = attributes.max || 3;
      const threshold = 1.0 - attributes.threshold || 0.6;
      if (services === null) {
        services = new Services(dictionary);
      }
      const FUNCTION = await resultFunctionAsync(conversationCredentials);

      const results = FUNCTION(update.message.text, content, threshold);
      if (
        results.length > 0
      ) {
        const formattedMessage = bot.formatSuggestEntities(results, before, max);
        bot.reply(update, formattedMessage);
      } else {
        bot.reply(update, RESPONSE_ON_NO_RESULTS);
      }
    } catch (error) {
      bot.reply(update, RESPONSE_ON_ERROR);
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('SuggestEntities.controller', { ACA_ERROR });
      throw ACA_ERROR;
    }
  },
});

module.exports = {
  SuggestEntities,
};
