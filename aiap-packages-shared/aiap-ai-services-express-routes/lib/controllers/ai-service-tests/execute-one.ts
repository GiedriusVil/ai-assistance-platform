/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-service-express-routes-ai-service-test-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  getAcaWorkerPoolManager,
} from '@ibm-aca/aca-worker-pool-manager-provider';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const executeOne = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  let context;
  let contextUserId;

  let workerJobName;
  let workerPoolManager;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;
    params = request?.body;

    /**
     * 2024-04-18 [jevgenij.golobokin]
     * Necessary to require @tensorflow/tfjs-node at this point for proper tensorflow initialization when using additional
     * workers for AI Tests execution:
     * const tfjs = require('@tensorflow/tfjs-node');
     * 
     * If import is not present tensorflow will throw the following error when executing tests one after another inside workers:
     * `
     * Error: Module did not self-register: '/home/node/app/node_modules/@tensorflow/tfjs-node/lib/napi-v8/tfjs_binding.node'
     * `
     */
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const tfjs = require('@tensorflow/tfjs-node');

    workerJobName = 'aca-ai-tests-executor-k-fold-execute-one.js';
    workerPoolManager = getAcaWorkerPoolManager();
    result = await workerPoolManager.execute(workerJobName, context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, params, workerJobName });
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
