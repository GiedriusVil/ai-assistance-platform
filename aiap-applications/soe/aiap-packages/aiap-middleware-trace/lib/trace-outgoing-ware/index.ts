/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-trace-outgoing-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  ISoeContextV1,
  ISoeOutgoingMessageFormattedV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

class TraceOutgoingWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'trace-ware-out',
      middlewareTypes.OUTGOING
    );
  }

  __shouldSkip(context: ISoeContextV1) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1, message: ISoeOutgoingMessageFormattedV1) {
    try {
      if (lodash.isEmpty(update?.traceId)) {
        const MESSAGE = `Missing required update.traceId parameter`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (lodash.isEmpty(update?.traceId?.conversationId)) {
        const MESSAGE = `Missing required update.traceId.conversationId parameter`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      if (lodash.isEmpty(update?.traceId?.utteranceId)) {
        const MESSAGE = `Missing required update.traceId.utteranceId parameter`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      message.traceId = update?.traceId;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('TraceOutgoingWare.executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  TraceOutgoingWare,
};
