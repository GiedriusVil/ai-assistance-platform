/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-classifier-service-apply-classifier-threshold';
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
  IClassificationModelV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  sendDebugMessage,
} from '@ibm-aiap/aiap-utils-soe-messages';

import {
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

export const applyClassifierThreshold = async (
  adapter: SoeBotV1,
  update: ISoeUpdateV1,
  aiServices: Array<IAiServiceV1>
) => {
  const debugMessage = `[DEBUG_MESSAGE] ${MODULE_ID}`;

  let model: IClassificationModelV1;
  let modelThresholdClassifier;

  let classifierThresholdTop;
  let classifierThresholdRange;
  let classifierThresholdMin;
  let classifierThresholdQuantity;

  let retVal;
  try {
    model = await getUpdateSessionContextClassificationModel(update);

    modelThresholdClassifier = model?.ware?.threshold?.classifier;

    classifierThresholdTop = modelThresholdClassifier?.top;
    classifierThresholdRange = modelThresholdClassifier?.range;
    classifierThresholdMin = modelThresholdClassifier?.min;
    classifierThresholdQuantity = modelThresholdClassifier?.quantity;

    if (
      !lodash.isNumber(classifierThresholdTop)
    ) {
      const MESSAGE = `Classifier model is missing numeric value of -> model.threshold.classifier.top!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      !lodash.isNumber(classifierThresholdRange)
    ) {
      const MESSAGE = `Classifier model is missing numeric value of -> model.threshold.classifier.range!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      !lodash.isNumber(classifierThresholdMin)
    ) {
      const MESSAGE = `Classifier model is missing numeric value of -> model.threshold.classifier.min!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      !lodash.isNumber(classifierThresholdQuantity)
    ) {
      const MESSAGE = `Classifier model is missing numeric value of -> model.threshold.classifier.quantity!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    retVal = [];
    aiServices = aiServices.filter(aiService => lodash.isNumber(aiService.rate));

    const AI_SERVICE_TOP = aiServices[0];
    if (
      AI_SERVICE_TOP &&
      AI_SERVICE_TOP.rate <= classifierThresholdTop
    ) {
      return retVal;
    }
    retVal.push(AI_SERVICE_TOP);
    aiServices.slice(1, classifierThresholdQuantity).forEach((aiService) => {
      if (lodash.isEmpty(aiService)) {
        return;
      }
      if (
        (AI_SERVICE_TOP.rate - aiService.rate) < classifierThresholdRange &&
        aiService.rate >= classifierThresholdMin
      ) {
        retVal.push(aiService);
      }
    });
    await sendDebugMessage(adapter, update, {
      MODULE_ID,
      debugMessage,
      aiServices,
      retVal,
    });
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelThresholdClassifier });
    logger.error(applyClassifierThreshold.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
