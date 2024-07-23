/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-trace-incoming-ware`;
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

import uuid from 'uuid/v4';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  ISoeContextV1,
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1
} from '@ibm-aiap/aiap-soe-bot';

class TraceIncomingWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'trace-ware-inc',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context: ISoeContextV1) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: [],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    let traceIdFromAdapter;
    let traceId;
    try {
      if (!lodash.isFunction(adapter.getTraceId)) {
        const ERROR_MESSAGE = 'Missing required adapter.getTraceId function!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      traceIdFromAdapter = adapter.getTraceId(update);
      if (lodash.isEmpty(traceIdFromAdapter)) {
        const ERROR_MESSAGE =
          'Unable to retrieve required traceIdFromAdapter value!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      traceId = update?.traceId;
      if (lodash.isEmpty(traceId)) {
        traceId = traceIdFromAdapter;
      }
      if (lodash.isEmpty(traceId?.conversationId)) {
        const ERROR_MESSAGE =
          'Missing mandatory trace.conversationId attribute!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }

      update.traceId = traceId;

      traceId.dialogId = update?.session?.dialogId || 'N/A';
      traceId.soeSocketIdServer = update?.raw?.socket?.id;
      traceId.utteranceId = uuid();
      traceId.messageId = uuid();

      // Define a function to get traceId at runtime from update message context
      const getTraceId = () => {
        const RET_VAL = update?.traceId;
        return RET_VAL;
      };
      update.getTraceId = getTraceId;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('TraceIncomingWare.executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  TraceIncomingWare,
};
