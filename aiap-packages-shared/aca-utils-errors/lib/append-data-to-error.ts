/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

const appendDataToError = (error, data) => {
  if (
    !lodash.isEmpty(error) &&
    !lodash.isEmpty(data)
  ) {
    const DATA_EXISTING = ramda.pathOr({}, ['data'], error);
    error.data = {
      ...DATA_EXISTING, ...data
    };
  }
}


export {
  appendDataToError,
}
