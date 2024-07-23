/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  SecretProviderV1Default,
} from './lib/secret-provider-default';

import {
  SecretProviderV1IbmCloud,
} from './lib/secret-provider-ibm-key-protect';

let secretProvider;

const init = (
  configuration: any,
) => {
  if (
    configuration?.keyProtect
  ) {
    secretProvider = new SecretProviderV1IbmCloud(configuration?.keyProtect);
  } else {
    secretProvider = new SecretProviderV1Default(null);
  }
  return secretProvider;
};

// const get = () => {
//   if (
//     !secretProvider
//   ) {
//     throw new Error('Secret provider is not initialized. Check if you call init() method first.');
//   }
//   return secretProvider;
// };

export {
  init,
}
