/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  jwt
} from '@ibm-aca/aca-wrapper-jsonwebtoken';

class TokenService {
  secret: string;

  constructor(config) {
    this.secret = config.conversationIdSecret;
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }

  sign(data) {
    return jwt.sign(data, this.secret);
  }
}

let serviceInstance;

const getInstance = config => {
  if (serviceInstance) {
    return serviceInstance;
  }
  serviceInstance = new TokenService(config);
  return serviceInstance;
};

export {
  TokenService,
  getInstance
} 

