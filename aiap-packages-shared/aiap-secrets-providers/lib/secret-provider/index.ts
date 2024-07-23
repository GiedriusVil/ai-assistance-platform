/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  ISecretProviderV1Configuration,
} from './configuration';

export abstract class SecretProviderV1<E extends ISecretProviderV1Configuration> {

  configuration: E;

  constructor(
    configuration: E,
  ) {
    this.configuration = configuration;
  }

  abstract init(): Promise<any>;

  abstract getValue(
    secret: any,
  );
}
