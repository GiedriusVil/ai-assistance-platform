/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app--types-chat-server-session-expiration-notifier';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import { Redlock } from '@ibm-aiap/aiap-wrapper-redlock';

import { getMemoryStore } from '@ibm-aiap/aiap-memory-store-provider';

import {
  getEventStreamChatApp,
} from '@ibm-aiap/aiap-event-stream-provider';

interface ChatServerV1SessionExpirationNotifierConfiguration {
  thresholdInSeconds: number, // 600 Seconds
  waitInMs: number, // 5000 
  lock: {
    resource: string, // 'session-timout-checker-lock'
    lengthInMS: number, // 10*1000
  },
  redlock: {
    driftFactor: number, // 0.01
    retryCount: number, // 10
    retryDelayInMs: number, // 200
    retryJitterInMs: number, // 200
    automaticExtensionThresholdInMs: number, // 500
  }
}

const _isPositive = (num) => {
  if (
    lodash.isNumber(num) &&
    Math.sign(num) === 1
  ) {
    return true;
  }
  return false;
}

class ChatServerV1SessionExpirationNotifierV1 {

  configuration: ChatServerV1SessionExpirationNotifierConfiguration;

  constructor(
    configuration: ChatServerV1SessionExpirationNotifierConfiguration,
  ) {
    this.configuration = configuration;
    if (
      !_isPositive(this.configuration?.thresholdInSeconds)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.thresholdInSeconds attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(this.configuration?.lock?.resource)
    ) {
      const ERROR_MESSAGE = `Missing required this.configuration?.lock?.resource attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.lock?.lengthInMS)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.lock?.lengthInMS attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.redlock?.driftFactor)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.redlock?.driftFactor attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.redlock?.retryCount)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.redlock?.retryCount attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.redlock?.retryDelayInMs)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.redlock?.retryDelayInMs attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.redlock?.retryJitterInMs)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.redlock?.retryJitterInMs attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !_isPositive(this.configuration?.redlock?.automaticExtensionThresholdInMs)
    ) {
      const ERROR_MESSAGE = `Non positive value of this.configuration?.redlock?.automaticExtensionThresholdInMs attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
  }

  async init() {
    try {
      this.run();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.init.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async run() {
    const STORE = getMemoryStore();

    const REDLOCK = new Redlock(
      [
        STORE.getStore(),
      ],
      {
        driftFactor: this.configuration?.redlock?.driftFactor,
        retryCount: this.configuration?.redlock?.retryCount,
        retryDelay: this.configuration?.redlock?.retryDelayInMs,
        retryJitter: this.configuration?.redlock?.retryJitterInMs,
        automaticExtensionThreshold: this.configuration?.redlock?.automaticExtensionThresholdInMs,
      }
    );
    const IS_ENDLESS_LOOP = true;
    while (IS_ENDLESS_LOOP) {
      try {
        // only allow one instance to run at a time
        const LOCK = await REDLOCK.lock(
          [
            this.configuration?.lock?.resource
          ],
          this.configuration?.lock?.lengthInMS,
        );
        try {
          await this.performCheck();
          await new Promise(resolve => setTimeout(
            resolve,
            this.configuration?.waitInMs,
          ));
        } catch (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          logger.error(this.run.name, { ACA_ERROR });

        } finally {
          await REDLOCK.unlock(LOCK);
        }
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(this.run.name, { ACA_ERROR });
      }
    }
  }

  async performCheck() {
    try {
      const STORE = getMemoryStore();

      const USER_SESSIONS_PATTERN = 'user_sess:*';
      const CONV_SESSIONS_PATTERN = 'conv_sess:*';

      const USER_SESSION_KEYS = await STORE.paternGet(USER_SESSIONS_PATTERN);
      const CONV_SESSION_KEYS = await STORE.paternGet(CONV_SESSIONS_PATTERN);

      const SESSION_KEYS = USER_SESSION_KEYS.concat(CONV_SESSION_KEYS);

      for (const SESSION_KEY of SESSION_KEYS) {

        const KEY_PREFIX = `aiap:${STORE.getKeyPrefix()}:`;
        const KEY = SESSION_KEY.replace(KEY_PREFIX, '');
        const TIME_TO_LIVE = await STORE.ttl(KEY);

        const SESSION = await STORE.get(KEY);
        const SESSION_CONVERSATION_ID = SESSION?.conversation?.id;

        if (
          TIME_TO_LIVE >= 0 &&
          TIME_TO_LIVE < this.configuration?.thresholdInSeconds
        ) {
          const EVENT_STREAM = getEventStreamChatApp();
          EVENT_STREAM.publish(
            SESSION_CONVERSATION_ID,
            {
              event: {
                code: 'SESSION_EXPIRATION_NOTIFICATION',
                key: KEY,
                timeToLive: TIME_TO_LIVE,
              },
            }
          );
        }
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.performCheck.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

export {
  ChatServerV1SessionExpirationNotifierV1,
}
