/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const retriesLens = name => R.lensPath(name);
const increment = R.pipe(
  R.defaultTo(0),
  R.inc
);
const setRetries = (name, session, value) => R.set(retriesLens(name), value)(session);
const viewRetries = (name, session) => R.view(retriesLens(name))(session);

module.exports = {
  increment,
  setRetries,
  viewRetries,
};
