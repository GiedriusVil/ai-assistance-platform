/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-utils';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  getEncrypter,
} from '@ibm-aiap/aiap-utils-encrypter';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

export const encryptObjectStorageApiAccessSecret = (
  secret: any,
  tenant: ITenantV1,
) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(tenant)
  ) {
    const MESSAGE = `Missing required tenant parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const API_SECRET = tenant?.objectStorage?.accessSecret;
  if (
    lodash.isEmpty(API_SECRET)
  ) {
    delete tenant?.objectStorage?.accessSecret;
  } else {
    const ENCRYPTOR = getEncrypter(secret);
    tenant.objectStorage.accessSecret = ENCRYPTOR.encrypt(API_SECRET);
  }
}

export const decryptObjectStorageApiAccessSecret = (
  secret: any,
  tenant: ITenantV1,
) => {
  if (
    lodash.isEmpty(secret)
  ) {
    const MESSAGE = `Missing required secret parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  if (
    lodash.isEmpty(tenant)
  ) {
    const MESSAGE = `Missing required tenant parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const API_SECRET = tenant?.objectStorage?.accessSecret;
  if (
    !lodash.isEmpty(API_SECRET)
  ) {
    const ENCRYPTOR = getEncrypter(secret);
    tenant.objectStorage.accessSecret = JSON.parse(ENCRYPTOR.decrypt(API_SECRET));
  }
}
