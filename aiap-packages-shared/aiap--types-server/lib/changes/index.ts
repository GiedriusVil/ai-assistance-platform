/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  CHANGE_ACTION,
} from '../change-action';

export interface IChangesV1<E> {
  id?: string,
  action: CHANGE_ACTION,
  docId: string,
  docType: string,
  docName: string,
  doc: E,
  docChanges: any,
  timestamp: Date,
}
