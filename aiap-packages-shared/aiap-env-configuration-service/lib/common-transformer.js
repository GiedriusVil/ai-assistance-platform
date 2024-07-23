/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { SCHEMA } = require('./common-schema');

const { validate } = require('./config');

let loadedConfig;

const enrichByLoadedConfiguration = (lConfig) => {
  loadedConfig = lConfig;
  return loadedConfig;
};

const appEnv = require('cfenv').getAppEnv();

const getConfiguration = () => {
  const CONFIGURATION_COMMON = {
    instanceId: appEnv.isLocal ? 'local' : loadedConfig.CF_INSTANCE_INDEX || Math.random() * 65000,
  }

  const RET_VAL = validate(
    CONFIGURATION_COMMON,
    SCHEMA,
  )
  return RET_VAL;
}

module.exports = {
  enrichByLoadedConfiguration,
  getConfiguration,
};

