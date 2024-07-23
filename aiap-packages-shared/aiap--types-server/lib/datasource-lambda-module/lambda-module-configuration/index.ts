/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface ILambdaModuleConfigurationV1 {
  key: string,
  value: any,
  id?: any,
  created?: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
  updated?: {
    user: { 
      id: string, 
      name: string 
    },
    date: string
  },
};
