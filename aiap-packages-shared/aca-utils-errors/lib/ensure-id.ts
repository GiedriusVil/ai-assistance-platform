/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

const ensureId = (error: any) => {
  if (
    lodash.isObject(error) &&
    lodash.isEmpty(error?.id)
  ) {
    error.id = uuidv4();
  }
}

export {
  ensureId,
}
