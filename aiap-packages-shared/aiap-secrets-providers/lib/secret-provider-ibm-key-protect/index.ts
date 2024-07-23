/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const crypto = require('crypto');

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  execHttpGetRequest,
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  SecretProviderV1,
} from '../secret-provider';

import {
  ISecretProviderV1IbmCloudConfiguration,
} from './configuration';

export class SecretProviderV1IbmCloud extends SecretProviderV1<ISecretProviderV1IbmCloudConfiguration> {

  iamAPIKey: any;
  iamAPITokenURL: any;
  keyProtectURL: any;
  keyProtectInstanceID: any;
  keyID: any;
  passphrase: any;
  salt1: any;
  salt2: any;

  decryptKey: any;

  constructor(
    configuration: ISecretProviderV1IbmCloudConfiguration,
  ) {
    super(configuration);

    this.iamAPIKey = configuration?.iamAPIKey;
    this.iamAPITokenURL = configuration?.iamAPITokenURL;
    this.keyProtectURL = configuration?.keyProtectURL;
    this.keyProtectInstanceID = configuration?.keyProtectInstanceID;
    this.keyID = configuration?.keyID;
    this.passphrase = configuration?.passphrase;
    this.salt1 = configuration?.salt1;
    this.salt2 = configuration?.salt2;
  }

  async init() {
    try {
      this.decryptKey = await this.__getDecryptKey();
    } catch (err) {
      throw new Error(`[ERROR] Failed to create IBM Key protect desipher: ${err}`);
    }
  }

  getValue(
    secret: any,
  ) {
    if (secret) {
      const decipher = crypto.createDecipheriv(
        'aes-192-cbc',
        crypto.scryptSync(
          this.passphrase,
          this.salt1 || '98721873cb02329fd1199b0cefb945f8dbd03ab1895cfc328f037417af2afde8d7a50cf43e9309',
          24
        ),
        Buffer.alloc(16, 0)
      );

      const decrypted = crypto.privateDecrypt(
        {
          key: this.decryptKey,
          passphrase: crypto
            .pbkdf2Sync(this.passphrase, this.salt2 || '9Tx+D4A7n^eh#?ZUhY#V', 1000, 64, 'sha512')
            .toString('hex'),
        },
        Buffer.from(secret, 'base64')
      );

      let dec = decipher.update(decrypted.toString('base64'), 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    }
  }

  async __getDecryptKey() {
    const iamAPIToken = await this.__getIAMAPIToken();
    const opts = {
      headers: { Authorization: `Bearer ${iamAPIToken}`, 'bluemix-instance': `${this.keyProtectInstanceID}` },
      url: `${this.keyProtectURL}${this.keyID}`,
      options: {
        timeout: 5000,
      },
    };
    const RESPONSE = await execHttpGetRequest({}, opts);

    const RET_VAL = `-----BEGIN ENCRYPTED PRIVATE KEY-----\n${ramda.defaultTo({}, ramda.find(ramda.propEq('id', this.keyID), RESPONSE?.body?.resources)).payload
      }\n-----END ENCRYPTED PRIVATE KEY-----`;

    return RET_VAL;
  }

  async __getIAMAPIToken() {
    const opts = {
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      url: this.iamAPITokenURL,
      options: {
        timeout: 5000,
      },
    };
    const additionalOptions = {
      form: {
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: this.iamAPIKey,
      },
    };

    const RESPONSE = await execHttpPostRequest({}, opts, additionalOptions);
    const RET_VAL = RESPONSE?.body?.access_token;
    return RET_VAL;
  }
}
