/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
interface IRedisClientConfigurationV1 {
  id: string,
  type: string,
  hash: string,
  name: string,
  url: string,
  password: string,
  keyPrefix?: string,
  sentinels?: any,
  tls?: {
    servername?: string,
    strictSSL?: any,
    pfx?: {
      pfx?: any,
      passphrase?: any,
    },
    cert?: {
      cert?: any,
      key?: any,
      passphrase?: any,
      ca?: any,
    }
  },
}

interface IRedisClientIoRedisConfigurationV1 extends IRedisClientConfigurationV1 {
  retryStrategy: AsyncGeneratorFunction,
  cluster?: {
    hosts: Array<string>
  },
  encryption?: {
    key: any,
    hmacKey: any,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRedisClientNodeRedisConfigurationV1 extends IRedisClientConfigurationV1 {

}

export {
  IRedisClientConfigurationV1,
  IRedisClientIoRedisConfigurationV1,
  IRedisClientNodeRedisConfigurationV1,
}
