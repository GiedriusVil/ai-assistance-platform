/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-classifier-service-retrieve-ai-services-from-classifier';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionContextClassificationModel,
} from '@ibm-aiap/aiap-utils-soe-update';

const retrieveAiServicesFromClassifier = async (
  update: ISoeUpdateV1,
) => {
  let updateRequestMessageText;

  let model;
  let modelId;
  let modelServiceUrl;

  let tenantId;

  let requestUrl;
  let aiServices;
  try {
    updateRequestMessageText = update?.request?.message?.text;

    model = await getUpdateSessionContextClassificationModel(update);
    modelId = model?.id;
    modelServiceUrl = model?.serviceUrl;

    tenantId = update?.raw?.gAcaProps?.tenantId;

    if (
      lodash.isEmpty(modelId)
    ) {
      const MESSAGE = `Unable to retrieve model.id from session context!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(modelServiceUrl)
    ) {
      const MESSAGE = `Unable to retrieve model.serviceUrl from session context!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    requestUrl = `${modelServiceUrl}/api/classifier/predict`;

    const POST_REQUEST_OPTIONS = {
      url: requestUrl,
      body: {
        text: updateRequestMessageText,
        tenantId: tenantId,
        modelId: modelId,
      },
      options: {
        timeout: 1200000
      }
    };

    logger.info(retrieveAiServicesFromClassifier.name,
      {
        requestUrl,
        POST_REQUEST_OPTIONS,
      });

    const RESPONSE = await execHttpPostRequest({}, POST_REQUEST_OPTIONS);

    aiServices = RESPONSE?.body?.results;

    const RET_VAL = [];
    if (
      lodash.isArray(aiServices) &&
      !lodash.isEmpty(aiServices)
    ) {
      aiServices.sort((a, b) => {
        return b.rate - a.rate;
      });
      RET_VAL.push(...aiServices);
    }
    logger.info(retrieveAiServicesFromClassifier.name, { RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAiServicesFromClassifier.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  retrieveAiServicesFromClassifier,
}
