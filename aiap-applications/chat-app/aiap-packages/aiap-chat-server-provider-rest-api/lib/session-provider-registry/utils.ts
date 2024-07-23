/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  retrieveStoredSession
} from '@ibm-aca/aca-utils-session';

const isSessionValid = async (session) => {
  const STORED_SESSION = await retrieveStoredSession(session);
  if (!lodash.isEmpty(STORED_SESSION)) {
    return true;
  } else {
    return false;
  }
}
export {
  isSessionValid
}
