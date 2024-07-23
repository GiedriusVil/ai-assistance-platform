/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const ensureModuleId = (
  moduleId: string,
  error: any
) => {
  if (
    lodash.isObject(error) &&
    lodash.isEmpty(error?.moduleId)
  ) {
    error.moduleId = moduleId;
  }
}

export {
  ensureModuleId,
}
