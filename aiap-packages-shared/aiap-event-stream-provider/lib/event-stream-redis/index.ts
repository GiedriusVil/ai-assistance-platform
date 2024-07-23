/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-event-stream-provider-event-stream-redis';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const NRP = require('node-redis-pubsub');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  RedisClientNodeRedisV1,
  getRedisClientNodeRedis,
} from '@ibm-aiap/aiap-redis-client-provider';

import {
  IEventStreamConfigurationRedisV1,
  EventStreamV1,
} from '../types';

class EventStreamRedisV1 extends EventStreamV1<IEventStreamConfigurationRedisV1> {

  emitter: RedisClientNodeRedisV1;
  receiver: RedisClientNodeRedisV1;

  nrp: any;

  scope: string;

  constructor(configuration) {
    try {
      super(configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    const EMITTER_ID = this.configuration?.clientEmitter;
    const EMITTER_HASH = this.configuration?.clientEmitterHash;

    const RECEIVER_ID = this.configuration?.clientReceiver;
    const RECEIVER_HASH = this.configuration?.clientReceiverHash;

    const SCOPE = this.configuration?.scope;
    try {
      if (
        lodash.isEmpty(EMITTER_ID)
      ) {
        const MESSAGE = `Missing this.configuration.clientEmmitter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(RECEIVER_ID)
      ) {
        const MESSAGE = `Missing this.configuration.clientReceiver!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(SCOPE)
      ) {
        const MESSAGE = `Missing this.configuration.scope!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      this.emitter = getRedisClientNodeRedis(EMITTER_ID, EMITTER_HASH);
      this.receiver = getRedisClientNodeRedis(RECEIVER_ID, RECEIVER_HASH);

      this.nrp = new NRP({
        emitter: this.emitter.client,
        receiver: this.receiver.client,
        scope: SCOPE,
      });
      this.nrp.on('error', this.onError.bind(this));
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { this_configuration: this.configuration })
      logger.error(`${this.initialize.name}`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get status() {
    const RET_VAL = {
      emitter: {
        configuration: this.emitter?.configuration,
        status: this.emitter?.status,
      },
      receiver: {
        configuration: this.receiver?.configuration,
        status: this.receiver?.status,
      }
    };
    return RET_VAL;
  }

  onError(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { this_configuration: this.configuration });
    logger.error('onError', { ACA_ERROR });
  }

  publish(
    type: any,
    data: any,
  ) {
    try {
      this.nrp.emit(type, data);
      logger.info(`publish`, {
        this_id: this.id,
        this_hash: this.hash,
        this_name: this.name,
        this_scope: this.scope,
        event: {
          type: type,
          data: data
        },
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, {
        this_id: this.id,
        this_hash: this.hash,
        this_name: this.name,
        this_scope: this.scope,
        event: {
          type: type,
          data: data
        },
      });
      logger.error(this.publish.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async subscribe(
    type: string,
    callback: (
      data: any,
      channel: any,
    ) => Promise<any>,
  ) {
    try {
      const RET_VAL = new Promise((resolve, reject) => {
        const unsubscribe = this.nrp.on(
          type,
          (data, channel) => {
            callback(data, channel);
          },
          () => {
            resolve(unsubscribe);
          }
        );
      });
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, {
        this_id: this.id,
        this_hash: this.hash,
        this_name: this.name,
        this_scope: this.scope,
        subscription: {
          type: type,
        }
      });
      logger.error(this.subscribe.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  EventStreamRedisV1,
}
