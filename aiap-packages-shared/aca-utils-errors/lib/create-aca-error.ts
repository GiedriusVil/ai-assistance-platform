/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ensureId } from './ensure-id';

import { ensureModuleId } from './ensure-module-id';

const createAcaError = (
  moduleId: string,
  type: string,
  message: string,
  data: any = null
) => {
  const RET_VAL: any = {
    type: type,
  };
  if (
    !lodash.isEmpty(message) &&
    lodash.isString(message) &&
    message.length > 10000
  ) {
    RET_VAL.message = message.substring(0, 9000);
  } else {
    RET_VAL.message = message;
  }
  if (
    !lodash.isEmpty(data)
  ) {
    RET_VAL.data = data;
  }
  ensureId(RET_VAL);
  ensureModuleId(moduleId, RET_VAL);
  return RET_VAL;
}

export {
  createAcaError
}
