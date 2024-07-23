/*
 © Copyright IBM Corporation 2022. All Rights Reserved 
  
 SPDX-License-Identifier: EPL-2.0
*/
interface IEventStreamConfigurationV1 {
  id: string,
  type: string,
  hash: string,
  name: string,
}

interface IEventStreamConfigurationRedisV1 extends IEventStreamConfigurationV1 {
  clientEmitter: any,
  clientEmitterHash: string,
  clientReceiver: any,
  clientReceiverHash: string,
  scope: string,
}

export {
  IEventStreamConfigurationV1,
  IEventStreamConfigurationRedisV1,
}
