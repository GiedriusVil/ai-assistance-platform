/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IMemoryStoreV1Configuration,
} from './memory-store-configuration';

export abstract class MemoryStoreV1<E extends IMemoryStoreV1Configuration> {

  configuration: E;

  _type: string;

  _status: string;

  constructor(
    configuration: E,
  ) {
    this.configuration = configuration;
  }

  type(): string {
    return this._type;
  }

}
