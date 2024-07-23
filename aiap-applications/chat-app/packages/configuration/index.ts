/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-custom-config';

import {
load,
  mergeConfiguration,
} from '@ibm-aiap/aiap-env-configuration-service';

import {
  isStringTrue
} from './lib/utils';

import {
  transformRawConfiguration
} from './lib/transformer';

import schema from './lib/schema';

let configuration;

const loadConfiguration = async () => {
  const LOADER_OPTS = {
    ...(isStringTrue(process.env.GIT_CONFIG_ENABLED) && { source: 'GIT_REPO' }),
  };
  const OPTS = isStringTrue(process.env.GIT_CONFIG_ENABLED)
    ? {
      personalToken: process.env.GIT_CONFIG_PERSONAL_TOKEN,
      uri: process.env.GIT_CONFIG_URL,
      file: process.env.GIT_CONFIG_FILE
    }
    : {};
  const CONFIGURATION_RAW = await load(LOADER_OPTS, OPTS);
  const CONFIGURATION = await transformRawConfiguration(CONFIGURATION_RAW);
  
  const RET_VAL = await mergeConfiguration(
    CONFIGURATION,
    schema
    );
    configuration = RET_VAL;
    return RET_VAL;
}

const getConfiguration = () => {
  if (
    configuration
  ) {
    return configuration;
  } else {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Load configuration first!`
    }
    throw ACA_ERROR;
  }
}

export {
  loadConfiguration,
  getConfiguration
};
