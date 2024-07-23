/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ibm-secrets-manager-client-provider-client-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE, throwAcaError } from '@ibm-aca/aca-utils-errors';

import { AIAPIbmSecretsManagerClientV2 } from '../client-v2';
import { AIAPIbmSecretsManagerClientV1 } from '../client-v1';

const createClient = async (configuration) => {
  if (lodash.isEmpty(configuration)) {
    const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
  }

  let retVal;

  switch (configuration.options.version) {
    case 'v1': {
      retVal = new AIAPIbmSecretsManagerClientV1(configuration);
      break;
    }
    case 'v2': {
      retVal = new AIAPIbmSecretsManagerClientV2(configuration);
      break;
    }
    default: {
      const MESSAGE = 'Unknown secrets manager version!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configuration });
    }
  }

  await retVal.initialize();
  return retVal;
}

const createClients = async (configurations) => {
  if (!lodash.isArray(configurations)) {
    const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { configurations });
  }
  const PROMISES = configurations.map((configuration) => {
    return createClient(configuration);
  });
  const RET_VAL = await Promise.all(PROMISES);
  return RET_VAL;
}

const clientFactory = {
  createClient,
  createClients,
};

export {
  clientFactory,
}
