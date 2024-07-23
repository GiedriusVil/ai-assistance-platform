/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IMemoryStoreV1 {

  type(): string;

  get(
    id: string
  ): Promise<any>;

  getData(
    id: string
  ): Promise<any>;

  getKeyPrefix(): string;

  getKeyPrefixAbsolute(): string;

  set(
    id: string,
    item: any,
    expiration?: number,
  ): Promise<any>;

  setData(
    id: string,
    item: any,
    expiration?: number,
  ): Promise<any>;

  remove(
    id: string,
  ): Promise<any>;

  paternGet(
    id: string,
  ): Promise<any>;

  status(): Promise<string>;

  ttl(
    key: string,
  ): Promise<any>;

  getStore(): any;

}
