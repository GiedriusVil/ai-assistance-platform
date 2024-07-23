/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IFileV1 {
  id?: string,
  bucketId: string,
  reference: string,
  file: {
    name: string,
    mimetype: string,
    path: string,
    size: number,
  }
}
