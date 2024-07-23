/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 *  Action to create a list of suggested entities
 */
const MODULE_ID = `aca-common-botmaster-actions-suggest-entities-suggest-entities-ng`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const { FuseJS } = require('@ibm-aca/aca-wrapper-fuse-js');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const Services = require('./services');
var services = null;

const resultFunctionAsync = async (conversationCredentials, waService, update) => {
  let entities;
  let spellchecker;
  try {
    entities = services.getEntities(conversationCredentials, waService);
    spellchecker = services.spellcheckerPromise();

    const DEFAULT_ENITIES = ramda.compose(ramda.flatten, ramda.values)(entities);

    const getSpecifiedEntities = (specified) =>
      ramda.compose(ramda.flatten, ramda.props(specified))(entities);

    const parseSpecifiedEntities = (contents) =>
      contents.replace(/@/g, '').split(',').map(e => e.trim());

    const RET_VAL = (searchString, specifiedEntities, threshold) => {
      const FUSE_OPTIONS = { keys: ['entity'], includeScore: true, threshold };
      let fuse;
      if (specifiedEntities) {
        const entities = ramda.compose(
          ramda.reject(ramda.isNil),
          getSpecifiedEntities,
          parseSpecifiedEntities
        )(specifiedEntities);

        if (logger.isDebug())
          logger.debug(`[ACTIONS][SUGGEST-ENTITIES] Using specified entities (${entities.length} entities)`, {
            update,
          });
        fuse = new FuseJS(entities, FUSE_OPTIONS);
      } else {
        fuse = new FuseJS(DEFAULT_ENITIES, FUSE_OPTIONS);
        if (logger.isDebug())
          logger.debug('[ACTIONS][SUGGEST-ENTITIES] Entities not specified using default entities', { update });
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
 * @param {Object} credentials username, password and workspaceId for conversation
 */
const SuggestEntitiesNg = (credentials, dictionary, waService) => ({
  replace: 'before',
  controller: async ({ update, bot, content, attributes, before }) => {
    const RESPONSE_ON_NO_RESULTS = credentials.responseOnNoResults;
    const RESPONSE_ON_ERROR = credentials.responseOnError;
    try {
      let conversationCredentials = {
        serviceId: credentials.id || update.session.wcs.service,
      };
      if (credentials.name) {
        conversationCredentials.workspaceName = credentials.name;
      } else {
        conversationCredentials.workspaceId = update.session.wcs.workspaceId;
      }
      const max = attributes.max || 3;
      const threshold = 1.0 - attributes.threshold || 0.6;
      if (services === null) {
        services = new Services(dictionary);
      }
      const FUNCTION = await resultFunctionAsync(conversationCredentials, waService, update);
      const results = FUNCTION(update.message.text, content, threshold);
      if (results.length > 0) {
        const formattedMessage = bot.formatSuggestEntities(results, before, max);
        return bot.reply(update, formattedMessage);
      } else {
        return bot.reply(update, RESPONSE_ON_NO_RESULTS);
      }
    } catch (error) {
      bot.reply(update, RESPONSE_ON_ERROR);
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('SuggestEntitiesNg.controller', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
});

module.exports = {
  SuggestEntitiesNg,
};
