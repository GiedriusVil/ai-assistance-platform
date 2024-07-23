/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-analytics-abstract-message-logger-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  AbstractLoggerWare,
} from '../abstract-logger-ware';
import { SoeBotV1 } from '@ibm-aiap/aiap-soe-bot';

export abstract class AbstractMessageLoggerWare extends AbstractLoggerWare {

  constructor(
    botStates,
    loggerName,
    middlewareTypes,
    configuration,
  ) {
    super(botStates, loggerName, middlewareTypes, configuration);
  }

  abstract getMessage(
    update: ISoeUpdateV1,
    message: any,
  ): any;

  abstract getAuthor(
    update: ISoeUpdateV1,
    message: any,
  ): any;

  abstract getAttachment(
    message: any,
  ): any;

  abstract getAction(
    message: any,
  ): any;

  abstract executor(
    bot: SoeBotV1,
    update: ISoeUpdateV1,
    message?: any,
  ): Promise<any>;

  getStatus() {
    return null;
  }

  getCreated() {
    const RET_VAL = new Date();
    return RET_VAL;
  }

  getMessageId(
    update: ISoeUpdateV1,
    message = undefined
  ) {
    let retVal;
    if (
      !lodash.isEmpty(message)
    ) {
      retVal = message?.id;
    } else {
      retVal = update?.traceId?.messageId;
    }
    if (
      lodash.isEmpty(retVal)
    ) {
      const ERROR_MESSAGE = `Unable retrieve messageId from udpate or message!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    return retVal;
  }


  formRecord(
    update: ISoeUpdateV1,
    message: any,
  ) {
    try {
      const ERROR_MESSAGE = `Missing AbstractMessageLoggerWare.formRecord function implementation!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('formRecord', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}
