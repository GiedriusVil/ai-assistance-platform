/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-classifier-service-apply-ai-service-threshold';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseV1,
  IAiServiceRequestV1,
  IAiServiceV1,
  IClassificationModelV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  IAiServiceAdapterV1,
  IAiServiceAdapterV1RegistryV1,
} from '@ibm-aiap/aiap-ai-service-adapter-provider';

import {
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAiServicesDatasourceByTenant
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  getRegistry,
} from '@ibm-aiap/aiap-ai-service-adapter-provider';

import {
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';
import { IRetrieveConfidenceResponseV1 } from '@ibm-aiap/aiap-ai-service-adapter-provider/dist/lib/types';

const _applyAiServiceThresholdByAiService = async (
  update: ISoeUpdateV1,
  params: any,
) => {
  let paramsAiService: IAiServiceV1;

  let updateRequestMessageText;
  let text;

  let model: IClassificationModelV1;
  let aiServiceThresholdMin;
  let intentThresholdQuantity;

  let gAcaProps;
  let tenantsCacheProvider;
  let tenant;
  let aiServiceIntents;
  let aiServiceDatasource;
  let aiServiceId;
  let aiSkillId;
  let aiService: IAiServiceV1;
  let aiServiceAdapterRegistry: IAiServiceAdapterV1RegistryV1;
  let aiServiceAdapter: IAiServiceAdapterV1;

  let aiServiceRequest: IAiServiceRequestV1;
  let aiServiceResponse: IAiServiceResponseV1;

  let confidence: IRetrieveConfidenceResponseV1;

  try {
    paramsAiService = params?.aiService;
    if (
      lodash.isEmpty(paramsAiService)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    updateRequestMessageText = update?.request?.message?.text;
    if (
      !lodash.isEmpty(updateRequestMessageText)
    ) {
      text = updateRequestMessageText
        .replace(/’/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');
    }
    model = await getUpdateSessionContextClassificationModel(update);
    aiServiceThresholdMin = model?.ware?.threshold?.aiService?.min;
    intentThresholdQuantity = model?.ware?.threshold?.intent?.quantity;
    gAcaProps = update?.raw?.gAcaProps; // TODO [LEGO] -> Why we are using raw to get gAcaProps?
    tenantsCacheProvider = getTenantsCacheProvider();
    tenant = await tenantsCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    aiServiceDatasource = getAiServicesDatasourceByTenant(tenant);

    aiServiceId = paramsAiService?.aiServiceId;
    aiSkillId = paramsAiService?.aiSkillId;

    const PROMISES = [];
    PROMISES.push(aiServiceDatasource.aiServices.findOneById(
      {
        user: {
          id: 'SYSTEM_SOE',
        }
      },
      {
        id: aiServiceId,
      }
    ));
    PROMISES.push(aiServiceDatasource.aiSkills.findOneById(
      { user: { id: 'SYSTEM_SOE' } },
      { id: aiSkillId }
    ));

    const PROMISES_RESULT = await Promise.all(PROMISES);

    aiService = PROMISES_RESULT[0];
    aiService.aiSkill = PROMISES_RESULT[1];

    aiServiceAdapterRegistry = getRegistry();

    aiServiceAdapter = aiServiceAdapterRegistry[aiService?.type];

    aiServiceRequest = await aiServiceAdapter.request.constructOneForConfidenceCheck(
      {},
      {
        text,
        aiService,
        update,
      },
    );
    aiServiceResponse = await aiServiceAdapter.request.sendOneForConfidenceCheck(
      {},
      {
        aiService,
        aiServiceRequest,
      }
    );
    confidence = await aiServiceAdapter.response.retrieveConfidence(
      {},
      {
        update,
        aiServiceResponse,
      }
    );
    if (
      confidence?.confidence >= aiServiceThresholdMin
    ) {
      paramsAiService.rate = confidence?.confidence;
    }
    if (
      intentThresholdQuantity > 0
    ) {
      aiServiceIntents = await aiServiceAdapter.response.retrieveIntents(
        {},
        {
          update,
          aiServiceResponse,
        }
      );
      paramsAiService.intents = aiServiceIntents?.intents;
    }
    return paramsAiService;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { paramsAiService, model, aiService });
    logger.error(_applyAiServiceThresholdByAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _filterAiServicesByThreshold = (
  model: IClassificationModelV1,
  params: {
    aiServices: Array<IAiServiceV1>
  }
) => {
  let modelThresholdAiService;

  let aiServiceThresholdTop;
  let aiServiceThresholdRange;
  let aiServiceThresholdMin;

  let paramsAiServices;

  let retVal;

  try {
    modelThresholdAiService = model?.ware?.threshold?.aiService;

    aiServiceThresholdTop = modelThresholdAiService?.top;
    aiServiceThresholdRange = modelThresholdAiService?.range;
    aiServiceThresholdMin = modelThresholdAiService?.min;

    paramsAiServices = params?.aiServices;

    retVal = [];

    paramsAiServices = paramsAiServices.filter((aiService: IAiServiceV1) => lodash.isNumber(aiService.rate));

    if (
      !lodash.isEmpty(paramsAiServices) &&
      lodash.isArray(paramsAiServices)
    ) {
      const AI_SERVICE_TOP: IAiServiceV1 = paramsAiServices[0];
      if (
        AI_SERVICE_TOP.rate <= aiServiceThresholdTop
      ) {
        return retVal;
      }
      retVal.push(AI_SERVICE_TOP);
      paramsAiServices.slice(1).forEach((aiService: IAiServiceV1) => {
        if (
          (AI_SERVICE_TOP.rate - aiService.rate) < aiServiceThresholdRange &&
          aiService.rate >= aiServiceThresholdMin
        ) {
          retVal.push(aiService);
        }
      });
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelThresholdAiService, paramsAiServices, retVal });
    logger.error(_filterAiServicesByThreshold.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const applyAiServiceThreshold = async (
  bot: SoeBotV1,
  update: ISoeUpdateV1,
  aiServices: Array<IAiServiceV1>,
) => {
  let debugMessage;

  let model: IClassificationModelV1;

  let modelThresholdAiService;

  let aiServiceThresholdTop;
  let aiServiceThresholdRange;
  let aiServiceThresholdMin;

  let results;
  let aiServicesValid;

  let retVal;
  try {
    model = await getUpdateSessionContextClassificationModel(update);

    modelThresholdAiService = model?.ware?.threshold?.aiService;

    aiServiceThresholdTop = modelThresholdAiService?.top;
    aiServiceThresholdRange = modelThresholdAiService?.range;
    aiServiceThresholdMin = modelThresholdAiService?.min;

    if (
      !lodash.isEmpty(aiServices) &&
      lodash.isArray(aiServices) &&
      lodash.isNumber(aiServiceThresholdTop) &&
      lodash.isNumber(aiServiceThresholdRange) &&
      lodash.isNumber(aiServiceThresholdMin)
    ) {
      const PROMISES = [];
      for (const AI_SERVICE of aiServices) {
        PROMISES.push(_applyAiServiceThresholdByAiService(update, { aiService: AI_SERVICE }));
      }

      results = await Promise.all(PROMISES);

      aiServicesValid = results.filter(i => i != null);

      retVal = _filterAiServicesByThreshold(model, { aiServices: aiServicesValid });
    } else {
      retVal = aiServices;
    }

    debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`;
    await sendDebugMessage(bot, update,
      {
        MODULE_ID,
        debugMessage,
        modelThresholdAiService,
        aiServices,
        results,
        aiServicesValid,
        retVal,
      });

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelThresholdAiService });
    logger.error(applyAiServiceThreshold.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
