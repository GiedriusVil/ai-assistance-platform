/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const { jwt } = require('@ibm-aca/aca-wrapper-jsonwebtoken');


const { getConfiguration } = require('@ibm-aiap/aiap-env-configuration-service');

const CONFIG = getConfiguration();

class TokenService {

  constructor() {
    this.secret = ramda.path(['app', 'conversationIdSecret'], CONFIG);
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }

  sign(data) {
    return jwt.sign(data, this.secret);
  }

}

let instance;

const getTokenService = () => {
  if (instance) {
    return instance;
  }
  instance = new TokenService();
  return instance;
};

module.exports = {
  getTokenService
};
