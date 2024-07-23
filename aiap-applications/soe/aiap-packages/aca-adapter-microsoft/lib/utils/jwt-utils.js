/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { jwt } = require('@ibm-aca/aca-wrapper-jsonwebtoken');

const extractAppIdFromToken = (token) => {
  const TOKEN = lodash.replace(token, 'Bearer ', '');
  const PAYLOAD = jwt.decode(TOKEN);
  const RET_VAL = ramda.path(['aud'], PAYLOAD);
  return RET_VAL;
}

module.exports = {
  extractAppIdFromToken,
};
