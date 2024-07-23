/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from '../ai-service';

export interface IAiDialogNodeV1 {
  type: AI_SERVICE_TYPE_ENUM,
  external:
  IAiDialogNodeExternalV1AwsLexV2 |
  IAiDialogNodeExternalV1ChatGptV3 |
  IAiDialogNodeExternalWaV1 |
  IAiDialogNodeExternalWaV2
  ,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiDialogNodeExternalV1AwsLexV2 {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiDialogNodeExternalV1ChatGptV3 {

}

export interface IAiDialogNodeExternalWaV1 {
  conditions?: any,
  output?: {
    generic: Array<{
      values: Array<any>
    }>,
  },
  dialog_node?: any,
  title?: any,
  type?: any,
  parent?: any,
  created?: any,
  createdDate?: any,
  createdTime?: any,
  updated?: any,
  updatedDate?: any,
  updatedTime?: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiDialogNodeExternalWaV2 {

}
