/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ISoeLeftPanelComponentV1 {
  position: any,
  host: string,
  path: string,
  type: string,
  params: {
    [key: string | number | symbol]: any,
  }
}
