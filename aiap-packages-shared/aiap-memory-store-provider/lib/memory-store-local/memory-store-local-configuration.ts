/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IMemoryStoreV1Configuration,
} from '../memory-store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMemoryStoreV1LocalConfiguration
  extends IMemoryStoreV1Configuration {
  expiration?: number;
}
