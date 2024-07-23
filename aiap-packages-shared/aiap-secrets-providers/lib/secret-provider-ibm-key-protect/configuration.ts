/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISecretProviderV1Configuration,
} from '../secret-provider/configuration';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISecretProviderV1IbmCloudConfiguration extends ISecretProviderV1Configuration {
  iamAPIKey: any;
  iamAPITokenURL: any;
  keyProtectURL: any;
  keyProtectInstanceID: any;
  keyID: any;
  passphrase: any;
  salt1: any;
  salt2: any;
}
