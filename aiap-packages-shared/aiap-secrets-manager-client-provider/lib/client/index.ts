/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

interface AIAPIbmSecretsManagerClient {
  initialize();
  getSecret(context, params);
  listAllSecrets(context, params);
}

export {
  AIAPIbmSecretsManagerClient
};
