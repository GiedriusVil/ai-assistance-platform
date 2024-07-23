/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'jwt-provider-jsonwebtoken';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  jwt,
} from '@ibm-aca/aca-wrapper-jsonwebtoken';

import {
  JWTProviderV1,
} from '../jwt-provider';

import * as _token from './token';

export class JWTProviderV1JsonWebToken extends JWTProviderV1 {

  _config: any;
  _secret: any;
  _expiration: any;

  constructor(
    config: any,
  ) {
    super();
    this._config = config;
    this._secret = config?.secret;
    this._expiration = config?.expiration;
    if (
      lodash.isEmpty(this._secret)
    ) {
      throw new Error(`[${MODULE_ID}] Missing mandatory config.secret parameter!`);
    }
    if (!lodash.isNumber(this._expiration)) {
      throw new Error(`[${MODULE_ID}] Missing mandatory config.expiration parameter!`);
    }
    logger.info('INITIALIZED');
  }

  get token() {
    const RET_VAL = {
      generateWithUserData: (params) => {
        return _token.generateWithUserData(jwt, this._config, params);
      },
    };
    return RET_VAL;
  }

  get config() {
    const RET_VAL = {
      retrieveSecret: () => {
        return this._secret;
      },
      retrieveExpiration: () => {
        return this._expiration;
      }
    };
    return RET_VAL;
  }

}
