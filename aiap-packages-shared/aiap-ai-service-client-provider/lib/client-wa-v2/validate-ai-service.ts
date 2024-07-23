/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-ai-service-client-provider-client-wa-v2-validate-ai-service`;

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  createAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiServiceExternalV1WaV2,
} from '@ibm-aiap/aiap--types-server';

export const _validateAiService = (
  aiService: IAiServiceV1,
) => {
  const ERRORS: Array<any> = [];
  const EXTERNAL = aiService?.external as IAiServiceExternalV1WaV2;
  if (
    lodash.isEmpty(EXTERNAL)
  ) {
    const MESSAGE = `Missing mandatory aiService?.external parameter!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(EXTERNAL?.version)
  ) {
    const MESSAGE = `Missing mandatory aiService?.external?.version parameter!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(EXTERNAL?.url)
  ) {
    const MESSAGE = `Missing mandatory aiService?.external?.url parameter!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(EXTERNAL?.apiKey)
  ) {
    const MESSAGE = `Missing mandatory aiService?.external?.apiKey parameter!`;
    const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    const MESSAGE = `Multiple aiService errors identified!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { ERRORS });
  }
}
