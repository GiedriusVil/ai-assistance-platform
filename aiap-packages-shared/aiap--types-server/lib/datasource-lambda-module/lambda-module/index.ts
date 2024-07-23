/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface ILambdaModuleV1 {
  id: string,
  type: string,
  code: string,
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
