/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  SecretsManagerAdapterV1IbmCloud,
} from './lib/adapter-ibm-cloud-secrets-manager-v1';


const REGISTRY: {
  [key: string]: SecretsManagerAdapterV1IbmCloud,
} = {
  /*
  ** ICSMA is an acronym for 'Ibm Cloud Secrets Manager Adapter'.
  */
  ICSMA: new SecretsManagerAdapterV1IbmCloud(),
};

const getRegistry = (): {
  [key: string]: SecretsManagerAdapterV1IbmCloud,
} => {
  return REGISTRY;
}

export {
  getRegistry,
}
