/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const logger = require('@ibm-aca/aca-common-logger')('enricher:incoming-ware');
const { Enrich } = require('./Enrich');

/**
 * Factory function to generate incoming ware for enrich
 * @param  {Object} $0 options
 * @param  {Object} $0.enrichers an object of enrichers
 * @param  {String} [$0.sessionPath] dot denoted path find the context in the update. defaults to 'context'
 * @param  {Object} [$0.params] optional additional params to pass to enrichers
 * @return {Function} botmaster middleware
 */
const EnrichIncomingWare = ({ enrichers, sessionPath = 'context', params = {} }) => {
  sessionPath = sessionPath.split('.');
  return (bot, update) => {
    params.bot = bot;
    params.update = update;
    const enrich = Enrich({ params, enrichers });
    const lensContext = ramda.lensPath(sessionPath);
    const oldContext = ramda.compose(
      ramda.defaultTo({}),
      ramda.view(lensContext)
    )(update);

    logger.debug(`enrich recieved update`, { update });
    logger.debug(`enrich got context`, { oldContext });
    enrich(oldContext, (err, context) => {
      if (err) { return err }
      else {
        logger.debug(`enrich sending new context`, { context });
        const oldContext = update[sessionPath[0]];
        // update context in place by setting the first property on path to context
        update[sessionPath[0]] = ramda.set(ramda.lensPath(sessionPath.splice(1)), context, oldContext);
        return;
      }
    });
  };
};

module.exports = { EnrichIncomingWare };
