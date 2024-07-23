/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 *  Main module for fulfill, defining the overall fulfill process
 *  @private
 */
const MODULE_ID = 'aca-middleware-fulfill-ware-fulfill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  parallel,
  series,
  apply,
} = require('@ibm-aiap/aiap-wrapper-async');

const { getTasks, isPendingActions: __isPendingActions, evalResponse } = require('./actions');

const { Notifier } = require('./utils');
const { parseToTree } = require('@ibm-aiap/aiap-wrapper-posthtml-parser');
const { __render } = require('@ibm-aiap/aiap-wrapper-posthtml-render');

const render = string => __render(string, { closingSingleTag: 'slash' });

/**
 * Test for remaining actions in a string
 * @param  {String}  string  input string to test for actions
 * @param  {Object}  actions actions to test for
 * @return {Boolean} whether any actions were found
 */
const isPendingActions = (string, actions) => __isPendingActions(parseToTree(string), actions);

/**
 * Fulfill any actions found in the input text
 * @param  {Object} actions actions to run
 * @param  {Object} context an object of aditional properties to expost though `params`
 * @param  {String} input the string to look for actions in
 * @param  {Array}  [tree] provided as a way to speed up recursion. You probably don't need to use this and providing it without fulfillPromise (or vice versa) will cause an error.
 * @param  {Array}  [fulfillPromise] Used to let controllers know that fulfill has completed (or hit an error) even though this is a recursed function. You probably don't need to use this.
 * @param  {Function} cb error first callback
 */
const fulfill = (actions, context, input, tree, fulfillPromise, cb) => {
  if (!cb) {
    const notifier = new Notifier();
    cb = notifier.wrapCb(tree);
    fulfillPromise = notifier.promise;
    tree = parseToTree(input);
  }
  if (logger.isDebug()) logger.debug(`Got tree:`, { tree });
  const tasks = getTasks(tree, actions, context, fulfillPromise);
  if (logger.isDebug())
    logger.debug(`Got ${tasks.parallel.length} parallel tasks and ${tasks.series.length} serial tasks`);
  parallel([apply(parallel, tasks.parallel), apply(series, tasks.series)], (err, responses) => {
    if (err) {
      cb(err);
    } else {
      ramda.forEach(
        ramda.curry(evalResponse)(tree, ramda.__),
        ramda.compose(
          ramda.filter(ramda.propSatisfies(evaluate => evaluate !== 'step', 'evaluate')),
          ramda.flatten
        )(responses)
      );
      if (logger.isDebug()) logger.debug(`tree is now:`, { tree });
      const response = render(tree);
      tree = parseToTree(response);
      if (__isPendingActions(tree, actions)) {
        if (logger.isDebug()) logger.debug(`recursing response:`, { text: response });
        fulfill(actions, context, response, tree, fulfillPromise, cb);
      } else {
        if (logger.isDebug()) logger.debug(`final response:`, { text: response });
        cb(null, response);
      }
    }
  });
};

module.exports = {
  fulfill,
  isPendingActions,
  Notifier,
};
