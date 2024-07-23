/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-engine-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeMiddlewareIncomingV1,
  ISoeMiddlewareOutgoingV1,
  ISoeShouldSkipContextV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  CoachStopWatch,
  COACH_STOP_WATCH_TYPES,
} from '@ibm-aca/aca-performance-manager';

import { AbstractBotV1 } from './abstract-bot-v1';

export class Middleware {

  incomingMiddlewareStack: ISoeMiddlewareIncomingV1[];
  outgoingMiddlewareStack: ISoeMiddlewareOutgoingV1[];

  /**
   * Singleton Middleware class every botmaster instance should own one of
   * incomingMiddleware and
   * outgoingMiddleware variables;
   *
   * This class is not part of the exposed API. Use botmaster.use instead
   * @ignore
   */
  constructor() {
    this.incomingMiddlewareStack = [];
    this.outgoingMiddlewareStack = [];
  }

  /**
   * Add middleware.
   * See botmaster #use for more info.
   * @ignore
   */
  __use(
    middleware: ISoeMiddlewareIncomingV1 | ISoeMiddlewareOutgoingV1
  ) {
    this.__validateMiddleware(middleware);

    if (
      middleware.type === 'incoming'
    ) {
      this.incomingMiddlewareStack.push(middleware);
      logger.info(
        `[ENGINE] Added ${middleware.name || 'nameless'} incoming middleware`
      );
    } else {
      this.outgoingMiddlewareStack.push(middleware);
      logger.info(
        `[ENGINE] Added ${middleware.name || 'nameless'} outgoing middleware`
      );
    }

    return this;
  }

  /**
   * Add Wrapped middleware
   * See botmaster #useWrapped for more info.
   * @ignore
   * @param {object} params
   */
  __useWrapped(
    incomingMiddleware: ISoeMiddlewareIncomingV1,
    outgoingMiddleware: ISoeMiddlewareOutgoingV1,
  ) {
    if (!incomingMiddleware || !outgoingMiddleware) {
      throw new Error(
        'useWrapped should be called with both an incoming and an outgoing middleware'
      );
    }
    this.__validateMiddleware(incomingMiddleware);
    this.__validateMiddleware(outgoingMiddleware);

    this.incomingMiddlewareStack.unshift(incomingMiddleware);
    this.outgoingMiddlewareStack.push(outgoingMiddleware);
    logger.info(
      `[ENGINE] Added wrapped ${incomingMiddleware.name || 'nameless'
      } incoming middleware`
    );
    logger.info(
      `[ENGINE] Added wrapped ${outgoingMiddleware.name || 'nameless'
      } outgoing middleware`
    );

    return this;
  }

  __validateMiddleware(
    middleware: ISoeMiddlewareIncomingV1 | ISoeMiddlewareOutgoingV1,
  ) {
    if (typeof middleware !== 'object') {
      throw new Error(
        `middleware should be an object. Not ${typeof middleware}`
      );
    }

    const middlewareController = middleware.controller;

    if (middleware.type !== 'incoming' && middleware.type !== 'outgoing') {
      throw new TypeError(
        "invalid middleware type. Type should be either 'incoming' or 'outgoing'"
      );
    }
    if (typeof middlewareController !== 'function') {
      throw new TypeError(
        `middleware controller can't be of type ${typeof middlewareController}. It needs to be a function`
      );
    }
  }

  async __runIncomingMiddleware(
    bot: AbstractBotV1,
    update: ISoeUpdateV1,
  ) {
    try {
      const CONTEXT = {
        bot,
        update,
        middlewareStack: this.incomingMiddlewareStack,
      };
      const PARAMS = {
        coachStopWatch: {
          gAcaProps: update?.raw?.gAcaProps,
          type: COACH_STOP_WATCH_TYPES.SOE_MIDDLEWARE_INC,
        },
      };
      const RET_VAL = await this.__runMiddlewareStackV2(CONTEXT, PARAMS);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__runIncomingMiddleware.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __runOutgoingMiddleware(
    bot: AbstractBotV1,
    associatedUpdate: ISoeUpdateV1,
    message: any,
  ) {
    try {
      const CONTEXT = {
        bot,
        update: associatedUpdate,
        message,
        middlewareStack: this.outgoingMiddlewareStack,
      };
      const PARAMS = {
        coachStopWatch: {
          gAcaProps: associatedUpdate?.raw?.gAcaProps,
          type: COACH_STOP_WATCH_TYPES.SOE_MIDDLEWARE_OUT,
        },
      };
      const RET_VAL = await this.__runMiddlewareStackV2(CONTEXT, PARAMS);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.__runOutgoingMiddleware.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async __runMiddlewareStackV2(
    context,
    params,
  ) {

    let bot;
    let update;
    let patchedBot;
    let message;
    let middlewares;
    let retVal;

    try {
      bot = context.bot;
      update = context.update;
      message = context.message;
      middlewares = context.middlewareStack;
      patchedBot = bot.__createBotPatchedWithUpdate(update);

      const COACH_STOP_WATCH = CoachStopWatch.getInstance(params);
      COACH_STOP_WATCH.start();

      for (const middleware of middlewares) {
        if (
          !this.__shouldSkip(middleware, context)
        ) {
          if (this.incomingMiddlewareStack === middlewares) {
            retVal = await middleware.controller(patchedBot, update);
          } else {
            retVal = await middleware.controller(patchedBot, update, message);
          }
          COACH_STOP_WATCH.lap(middleware.name);
          if ('skip' === retVal || 'cancel' === retVal) {
            retVal = 'cancel';
            break;
          }
        }
      }
      const PARAMS = {
        conversationId: update?.traceId?.conversationId,
        utteranceId: update?.traceId?.utteranceId,
        messageId: null,
      };
      if (
        lodash.isEmpty(message)
      ) {
        PARAMS.messageId = update?.traceId?.messageId;
      } else {
        PARAMS.messageId = message?.id;
      }
      COACH_STOP_WATCH.stopAndDestroy(PARAMS);
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('Middleware.__runMiddlewareStackV2', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  /**
   * Simply returns true or false based on whether this middleware function
   * should be run for this object.
   * @ignore
   * @param {object} options
   *
   * @example
   * // options is an object that can contain any of:
   * {
   *   includeEcho, // opt-in to get echo updates
   *   includeDelivery, // opt-in to get delivery updates
   *   includeRead, // opt-in to get read updates
   * }
   */
  __shouldSkip(
    middleware: ISoeMiddlewareIncomingV1 | ISoeMiddlewareOutgoingV1,
    context: ISoeShouldSkipContextV1,
  ) {
    // DEPRECATED: Does anyone use that? It should be removed
    const IGNORE_RECEIEVED_ECHO_UPDATE =
      !middleware.includeEcho && context?.update?.message?.is_echo;
    const IGNORE_RECEIVED_DELIVERY_UPDATE =
      !middleware.includeDelivery && context?.update?.delivery;
    const IGNORE_RECEIVED_READ_UPDATE =
      !middleware.includeRead && context?.update?.read;


    const IGNORE_MIDDLEWARE = middleware.shouldSkip(context);

    if (
      IGNORE_RECEIEVED_ECHO_UPDATE ||
      IGNORE_RECEIVED_DELIVERY_UPDATE ||
      IGNORE_RECEIVED_READ_UPDATE ||
      IGNORE_MIDDLEWARE
    ) {
      return true;
    }

    return false;
  }
}
