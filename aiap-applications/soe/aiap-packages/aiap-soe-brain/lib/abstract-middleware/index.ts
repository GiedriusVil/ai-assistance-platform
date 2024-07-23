/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-brain-abstract-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  middlewareTypes,
} from './constants';
import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';

class AbstractMiddleware {

  states: any;
  middlewareName: any;
  middlewareType: any;
  externalMiddleware: any;

  constructor(
    states: any,
    name: any,
    type: any,
    externalMiddleware?: any,
  ) {
    if (
      !states ||
      !name ||
      !type
    ) {
      logger.error('[MIDDLEWARE][ERROR] Missing middleware params', {
        states,
        name,
        type,
      });
      const ERROR_MESSAGE = `Missing required states || name || type parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      type !== middlewareTypes.INCOMING &&
      type !== middlewareTypes.OUTGOING
    ) {
      throw new Error('Wrong middleware type');
    }
    this.states = states;
    this.middlewareName = name;
    this.middlewareType = type;
    this.externalMiddleware = externalMiddleware;
    logger.debug('[MIDDLEWARE][CREATE]',
      {
        states: this.states,
        middlewareName: this.middlewareName,
        middlewareType: this.middlewareType,
        externalMiddleware: this.externalMiddleware,
      });
  }

  async executor(...params: Array<any>) {
    const ERROR_MESSAGE = `Missing executor implementation!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, { params });
  }

  /**
   * IncomingMiddleware
   *  args:
   *  0 - bot
   *  1 - update
   * OutgoingMiddleware
   *  args:
   *  0 - bot
   *  1 - update
   *  2 - message
   */

  __shouldSkip(
    params: {
      update: ISoeUpdateV1,
    },
  ) {
    const RET_VAL = false;
    return RET_VAL;
  }

  public middleware() {
    const RET_VAL = {
      type: this.middlewareType,
      name: this.middlewareName,
      shouldSkip: this.__shouldSkip,
      controller: async (...args) => {
        let retVal;
        try {
          if (
            (
              args[1] &&
              ramda.includes(args[1].status, this.states)
            ) ||
            !ramda.has('status')(args[1])
          ) {
            if (
              this.externalMiddleware
            ) {
              retVal = await this.externalMiddleware(...args);
            } else {
              retVal = await this.executor(...args);
            }
          } else {
            logger.debug('[MIDDLEWARE][SKIP]', {
              states: this.states,
              middlewareName: this.middlewareName,
              middlewareType: this.middlewareType,
              externalMiddleware: this.externalMiddleware,
            });

          }
          return retVal;
        } catch (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          logger.error('AbstractMiddleware.controller', { ACA_ERROR });
          throw ACA_ERROR;
        }
      },
    };
    return RET_VAL;
  }
}

export {
  AbstractMiddleware,
}
