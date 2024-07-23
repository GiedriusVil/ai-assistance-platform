/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as crypto from 'crypto';

class Encrypter {

  algorithm: any;
  key: any;
  iv: any;

  constructor(
    options: {
      algorithm: any,
      key: any,
      iv: any,
    }
  ) {
    this.algorithm = options.algorithm;
    this.key = options.key;
    this.iv = options.iv;
  }

  encrypt(
    data: any,
  ) {
    const CIPHER = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = CIPHER.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += CIPHER.final('hex');
    return encrypted;
  }

  decrypt(
    encryptedData: any,
  ) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

const getEncrypter = (
  encryptKey: any
) => {
  const ALGORITHM = 'aes-192-cbc';
  const KEY = crypto.scryptSync(encryptKey, 'salt', 24);
  const IV = Buffer.alloc(16, 0); // Initialization vector.

  return new Encrypter({
    algorithm: ALGORITHM,
    key: KEY,
    iv: IV,
  });
}

export {
  getEncrypter,
}
