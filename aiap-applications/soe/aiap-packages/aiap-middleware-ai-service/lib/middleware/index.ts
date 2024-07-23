/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-ai-service-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
  ISoeUpdateSessionV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  sendErrorMessage,
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getUpdateSession,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  IAiServiceAdapterV1,
  IAiServiceAdapterV1RegistryV1,
  getRegistry,
} from '@ibm-aiap/aiap-ai-service-adapter-provider';

const ON_ERROR_MESSAGE = `[ERROR_MESSAGE] ${MODULE_ID}`;

class AiServiceWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'ai-service-ware-inc',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(
    params: {
      update: ISoeUpdateV1,
    }
  ) {
    const PARAMS = {
      update: params?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(
    adapter: SoeBotV1,
    update: ISoeUpdateV1,
  ) {
    let updateSession: ISoeUpdateSessionV1;

    let aiServiceAdapterRegistry: IAiServiceAdapterV1RegistryV1;

    let aiService: IAiServiceV1;
    let aiServiceType: string;
    let aiServiceAdapter: IAiServiceAdapterV1;

    let aiServiceRequest: IAiServiceRequestV1;
    let aiServiceResponse: IAiServiceResponseV1;

    let response;
    let context;
    let state;

    try {
      updateSession = getUpdateSession(update);

      aiServiceAdapterRegistry = getRegistry();
      aiService = updateSession?.aiService;
      aiServiceType = aiService?.type;

      aiServiceAdapter = aiServiceAdapterRegistry[aiServiceType];

      if (
        lodash.isEmpty(aiServiceAdapter)
      ) {
        const ERROR_MESSAGE = `Unable to identify adapter by aiServiceType`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE, {
          aiServiceType,
        });
      }

      aiServiceRequest = await aiServiceAdapter.request.constructOne(
        {},
        {
          update,
        }
      );
      aiServiceResponse = await aiServiceAdapter.request.sendOne(
        {},
        {
          aiService,
          aiServiceRequest,
        }
      );
      response = await aiServiceAdapter.response.formatOne(
        {},
        {
          aiServiceResponse,
        }
      );
      state = await aiServiceAdapter.response.retrieveState(
        {},
        {
          update,
          aiServiceResponse,
        },
      );
      context = await aiServiceAdapter.response.retrieveContext(
        {},
        {
          update,
          aiServiceResponse,
        }
      );

      update.session.lastState = state;
      update.session.lastContext = context;

      update.aiServiceRequest = aiServiceRequest;
      update.aiServiceResponse = aiServiceResponse;

      update.response = response;

      const debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`;

      await sendDebugMessage(adapter, update, {
        MODULE_ID,
        debugMessage,
        aiServiceRequest,
        aiServiceResponse,
      });

      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { aiServiceType, aiServiceAdapter });
      logger.error(this.executor.name, { ACA_ERROR });
      await sendErrorMessage(adapter, update, ON_ERROR_MESSAGE, ACA_ERROR);
      throw ACA_ERROR;
    }
  }
}

export {
  AiServiceWare,
}
