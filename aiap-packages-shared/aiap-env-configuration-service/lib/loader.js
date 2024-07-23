/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { envStore, gitRepoStore } = require('./secrets-providers');

const SOURCES = {
  LOCAL_ENV: 'LOCAL_ENV',
  GIT_REPO: 'GIT_REPO',
};

const callLoaders = ({ source, useDefaultLoader = true }, opts) => {
  const loaders = [];
  if (source)
    switch (source.toUpperCase()) {
      case SOURCES.LOCAL_ENV:
        loaders.push(envStore(opts));
        break;
      case SOURCES.GIT_REPO:
        loaders.push(gitRepoStore(opts));
        break;
    }
  if (useDefaultLoader) loaders.unshift(envStore());
  return loaders;
};

module.exports = (loaderOpts, opts) => Promise.all(callLoaders(loaderOpts, opts)).then(ramda.mergeAll);
