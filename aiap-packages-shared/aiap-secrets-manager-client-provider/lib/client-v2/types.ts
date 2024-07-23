/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface SecretManagerV2GetSecretParams {
  secret: {
    id: string,
  }
}

export interface SecretManagerV2ListSecretsParams {
  limit?: number,
  offset?: number,
  search?: string,
  sortBy?: string,
  groups?: string[],
}
