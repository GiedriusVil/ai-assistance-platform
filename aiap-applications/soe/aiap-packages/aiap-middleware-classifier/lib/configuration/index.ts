/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-classifier';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

let _provider;

const setConfigurationProvider = (
  provider,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ERROR_MESSAGE = `Missing configuration provider! [aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
  }
  _provider = provider;
}

const getConfiguration = () => {
  const RET_VAL = _provider.getConfiguration();
  return RET_VAL;
}

const ensureConfigurationExists = () => {
  const CONFIG = getConfiguration();
  if (
    lodash.isEmpty(CONFIG)
  ) {
    const ERROR_MESSAGE = `Missing configuration!`
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
}

export {
  setConfigurationProvider,
  ensureConfigurationExists,
}
