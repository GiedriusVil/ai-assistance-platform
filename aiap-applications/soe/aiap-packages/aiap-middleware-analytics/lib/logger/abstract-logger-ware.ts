/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-analytics-abstract-logger-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  AbstractMiddleware
} from '@ibm-aiap/aiap-soe-brain';

export class AbstractLoggerWare extends AbstractMiddleware {

  configuration: any;

  constructor(
    botStates,
    loggerName,
    middlewareTypes,
    configuration,
  ) {
    super(botStates, loggerName, middlewareTypes);
    this.configuration = configuration;
  }

  getTenantId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.gAcaProps?.tenantId;
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ERROR_MESSAGE = `Unable retrieve update?.raw?.gAcaProps?.tenantId from udpate!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    return RET_VAL;
  }

  getAssistantId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.gAcaProps?.assistantId;
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ERROR_MESSAGE = `Unable retrieve conversat.id from udpate!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    return RET_VAL;
  }

  getConversationId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.traceId?.conversationId;
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ERROR_MESSAGE = `Unable retrieve update?.traceId?.conversationId from udpate!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    return RET_VAL;
  }

  getUtteranceId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.traceId?.utteranceId;
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ERROR_MESSAGE = `Unable retrieve update?.traceId?.utteranceId from udpate!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    return RET_VAL;
  }

}
