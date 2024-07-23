/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  SecretProviderV1,
} from '../secret-provider';

import {
  ISecretProviderV1DefaultConfiguration,
} from './configuration';

export class SecretProviderV1Default extends SecretProviderV1<ISecretProviderV1DefaultConfiguration> {

  constructor(
    configuration: ISecretProviderV1DefaultConfiguration,
  ) {
    super(configuration);
  }

  async init() {
    //
  }

  getValue(
    secret: any,
  ) {
    return secret;
  }
}
