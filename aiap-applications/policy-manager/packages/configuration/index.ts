/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  mergeConfiguration,
  load
} from '@ibm-aiap/aiap-env-configuration-service';

import { schema } from './lib/schema';
import { transformRawConfiguration } from './lib/transformer';

const {
  isStringTrue
} = require('./lib/utils');

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
  const RAW_CONFIG = await load(LOADER_OPTS, OPTS);
  const TRANSFORMED_CONFIG = await transformRawConfiguration(RAW_CONFIG);
  const RET_VAL = await mergeConfiguration(
    TRANSFORMED_CONFIG,
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
    const ERROR_MESSAGE = `Please, First load configuration!`
    throw new Error(ERROR_MESSAGE);
  }
}

export = {
  loadConfiguration,
  getConfiguration
};
