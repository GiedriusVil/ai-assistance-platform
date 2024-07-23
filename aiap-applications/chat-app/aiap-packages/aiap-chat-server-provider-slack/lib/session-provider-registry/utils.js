/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const {
  retrieveStoredSession
} = require('@ibm-aca/aca-utils-session');

const isSessionValid = async (session) => {
  const STORED_SESSION = await retrieveStoredSession(session);
  if (!lodash.isEmpty(STORED_SESSION)) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  isSessionValid
}
