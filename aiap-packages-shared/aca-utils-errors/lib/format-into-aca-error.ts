/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE } from './aca-error-types';

import { ensureId } from './ensure-id';
import { ensureModuleId } from './ensure-module-id';
import { createAcaError } from './create-aca-error';

const formatIntoAcaError = (
  moduleId: string,
  error: any
) => {
  let acaError;
  if (
    lodash.isError(error)
  ) {
    acaError = createAcaError(moduleId, ACA_ERROR_TYPE.SYSTEM_ERROR, `${error}`);
    acaError.external = {
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
    }
    if (
      error?.headers
    ) {
      acaError.external.headers = error?.headers;
    }
    if (
      error?.body
    ) {
      acaError.external.body = error?.body;
    }
    if (
      error?.statusCode ||
      error?.statusMessage
    ) {
      acaError.external.status = {
        code: error?.statusCode,
        message: error?.statusMessage,
      };
    }
    return acaError;
  }
  if (
    lodash.isEmpty(error)
  ) {
    acaError = createAcaError(moduleId, ACA_ERROR_TYPE.UNDEFINED_ERROR, `${error}`);
    return acaError;
  }
  if (
    lodash.isString(error)
  ) {
    acaError = createAcaError(moduleId, ACA_ERROR_TYPE.SYSTEM_ERROR, `${error}`);
    return acaError;
  }
  acaError = error;
  const ACA_ERROR_DATA = acaError?.data;
  if (
    lodash.isEmpty(ACA_ERROR_DATA)
  ) {
    acaError.data = {};
  }
  const ACA_ERROR_DATA_MODULE_ID = acaError?.data?.MODULE_ID;
  if (
    lodash.isEmpty(ACA_ERROR_DATA_MODULE_ID)
  ) {
    acaError.data.MODULE_ID = moduleId;
  }
  ensureId(acaError);
  ensureModuleId(moduleId, acaError);
  return acaError;
}

export {
  formatIntoAcaError
}
