/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'memory-store-local';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IMemoryStoreV1,
  MemoryStoreV1,
} from '../memory-store';

import {
  IMemoryStoreV1LocalConfiguration,
} from './memory-store-local-configuration';

export class MemoryStoreV1Local
  extends MemoryStoreV1<IMemoryStoreV1LocalConfiguration>
  implements IMemoryStoreV1 {

  expiration: number;

  items: {
    [key: string]: any,
  };

  expirationTimeouts: {
    [key: string]: any,
  }

  constructor(
    configuration: IMemoryStoreV1LocalConfiguration,
  ) {
    super(configuration);
    this._type = 'local';
    this._status = 'online';
    this.items = {};
    this.expirationTimeouts = {};
    this.expiration = configuration?.expiration;
    logger.info('Initialized', { configuration });
  }

  getData(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  setData(id: string, item: any, expiration?: number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async ttl(key: string) {
    return null;
  }

  getStore() {
    throw null;
  }

  getKeyPrefix(): string {
    return '';
  }

  getKeyPrefixAbsolute(): string {
    return '';
  }

  async status() {
    return this._status;
  }

  async get(
    id: string,
  ) {
    const item = this.items[id];
    if (item == undefined) {
      return undefined;
    } else {
      this.__stopItemDeletion(id);
    }
    return item;
  }

  async set(
    id: string,
    item: any,
  ) {
    this.items[id] = item;
  }

  getKeys(
    id: string,
  ) {
    return id;
  }

  async paternGet(
    id: string
  ): Promise<any> {
    return null;
  }

  async remove(
    id: string,
  ) {
    this.__startItemDeletion(id);
  }

  private __startItemDeletion(
    id: string,
  ) {
    this.expirationTimeouts[id] = setTimeout(() => {
      delete this.items[id];
      delete this.expirationTimeouts[id];
    }, this.expiration);
  }

  private __stopItemDeletion(
    id: string,
  ) {
    clearTimeout(this.expirationTimeouts[id]);
    delete this.expirationTimeouts[id];
  }

}
