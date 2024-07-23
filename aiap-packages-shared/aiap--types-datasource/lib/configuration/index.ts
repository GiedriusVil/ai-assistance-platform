/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface IDatasourceConfigurationV1 {
  id?: string,
  type: string,
  name: string,
  client?: string,
  clientHash?: string,
  hash?: string,
}

export {
  IDatasourceConfigurationV1,
}
