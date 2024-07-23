/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface SecretManagerV1GetSecretParams {
  secret: {
    id: string,
    type: string,
  }
}

export interface SecretManagerV1ListSecretsParams {
  limit?: number,
  offset?: number,
  search?: string,
  sortBy?: string,
  groups?: string[],
}
