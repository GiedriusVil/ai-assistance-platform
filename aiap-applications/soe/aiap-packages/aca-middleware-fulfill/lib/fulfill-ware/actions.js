/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 *  Functions to find actions and evaluate them
 *  @private
 */
const MODULE_ID = 'aca-middleware-fulfill-ware-actions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const {
  nextTick,
} = require('@ibm-aiap/aiap-wrapper-async');

const { Notifier } = require('./utils');

const { __render } = require('@ibm-aiap/aiap-wrapper-posthtml-render');

// ramda-style utils for procesing action arrays
const setName = (val, key) => ramda.set(ramda.lensProp('name'), key)(val);
const indexActionName = ramda.mapObjIndexed(setName);
const toArray = ramda.compose(
  ramda.values,
  indexActionName
);
const checkArray = actions => (Array.isArray(actions) ? actions : toArray(actions));
const actionApplies = (tree, action) => ramda.find(ramda.propEq('tag', action.name), tree);
const getPendingActions = (tree, actions) => ramda.filter(ramda.curry(actionApplies)(tree), actions);
const mapToNames = ramda.map(ramda.prop('name'));
const getPendingActionNames = (tree, actions) =>
  ramda.compose(
    mapToNames,
    ramda.curry(getPendingActions)(tree)
  )(actions);
const isPendingActions = (tree, actions) => getPendingActionNames(tree, checkArray(actions)).length > 0;
const seriesActions = ramda.filter(ramda.prop('series'));
const parallelActions = ramda.filter(
  ramda.compose(
    ramda.not,
    ramda.prop('series')
  )
);
const isSync = ramda.allPass([x => !ramda.isNil(x), ramda.anyPass([ramda.is(String), ramda.is(Number)])]);
const clearNodes = (start, end, tree) =>
  ramda.range(start, end).forEach(i => {
    tree[i] = '';
  });

const render = string => __render(string, { closingSingleTag: 'slash' });

// get an object specifying serial and parallal tasks
const getTasks = (tree, actions, context, fulfillPromise) => {
  const tasks = evalActions(tree, actions, context);
  return {
    series: ramda.compose(
      ramda.map(createTask(tree, fulfillPromise)),
      seriesActions
    )(tasks),
    parallel: ramda.compose(
      ramda.map(createTask(tree, fulfillPromise)),
      parallelActions
    )(tasks),
  };
};

// create an async task by taking the "task" spec which specifies a certain action
const createTask = (tree, fulfillPromise) => task => cb => {
  const typeNotifier = new Notifier();
  typeNotifier.promise.then(type => {
    if (logger.isDebug()) logger.debug(`${task.name} controller based on its return type looks like a ${type}`);
  });
  let callbackCalled = false;
  const internalCallback = (error, response) => {
    if (!callbackCalled) {
      callbackCalled = true;
      if (logger.isDebug()) logger.debug(`${task.name} ${task.index} got a response ${response}`);
      task.response = response || '';
      if (task.evaluate == 'step') {
        evalResponse(tree, task);
        logger.debug(`tree is now `, { tree });
      }
      cb(error, task);
    } else {
      if (logger.isDebug()) logger.debug('refusing to call callback twice.');
    }
  };
  const actionCallback = (err, response) => {
    typeNotifier.promise.then(type => {
      if (type == 'async' || err || response) {
        internalCallback(err, response);
        if (logger.isDebug()) logger.debug(`${task.name} called its callback, so is actually async`);
      }
    });
    return fulfillPromise;
  };

  let result, error;
  try {
    result = task.controller(task.params, actionCallback);
  } catch (err) {
    error = err;
    if (logger.isDebug()) logger.debug(`error in ${task.name}: ${err.message}`);
    nextTick(() => cb(err));
  }

  if (!error) {
    nextTick(() => {
      if (result && typeof result.then == 'function' && result !== fulfillPromise) {
        typeNotifier.complete('promise');
        result.then(response => internalCallback(null, response)).catch(internalCallback);
      } else if (isSync(result)) {
        typeNotifier.complete('sync');
        nextTick(() => internalCallback(null, result));
      } else {
        typeNotifier.complete('async');
      }
    });
  }
};

const makeParams = (index, el, tree, context) => {
  const params = {
    attributes: el.attrs || {},
    tree,
    get index() {
      return ramda.compose(
        ramda.findIndex(ramda.propEq('index', '' + index)),
        ramda.values(),
        ramda.filter(ramda.propEq('tag', el.tag)), // then filter for elements in the tree that are the same as the current one
        ramda.mapObjIndexed((val, key) => ramda.set(ramda.lensProp('index'), key, val))
      )(tree);
    },
    get tag() {
      return render(el);
    },
    get content() {
      return render(el.content);
    },
    get before() {
      return render(tree.slice(0, index));
    },
    get after() {
      return render(tree.slice(index + 1));
    },
    get all() {
      return render(tree.filter(e => !e.tag));
    },
  };
  for (const prop in context) {
    params[prop] = context[prop];
  }
  return params;
};

// get a list of all action tags of a particular type along with their params
const evalActions = (tree, actions, context, tasks = []) => {
  tree.forEach((el, index) => {
    if (el && ramda.has(el.tag, actions))
      tasks.push(
        ramda.mergeRight(actions[el.tag], {
          params: makeParams(index, el, tree, context),
          index,
          name: el.tag,
          el,
        })
      );
  });
  if (logger.isDebug()) logger.debug(`Got ${tasks.length} tasks`);
  return tasks;
};

// update the tree the responses from a particular action
const evalResponse = (tree, task) => {
  // check if another task modified this task
  if (!tree[task.index] || !tree[task.index].tag || tree[task.index].tag !== task.name) return tree[task.index];
  else if (typeof task.replace == 'function') task.replace(tree, task);
  else {
    switch (task.replace) {
      case 'before':
        clearNodes(0, task.index, tree);
        tree[task.index] = task.response;
        break;
      case 'after':
        clearNodes(task.index, tree.length, tree);
        tree[task.index] = task.response;
        break;
      case 'all':
        tree.length = 0;
        tree[0] = task.response;
        break;
      default:
        tree[task.index] = task.response;
    }
  }
};

module.exports = {
  getTasks,
  isPendingActions,
  evalResponse,
};
