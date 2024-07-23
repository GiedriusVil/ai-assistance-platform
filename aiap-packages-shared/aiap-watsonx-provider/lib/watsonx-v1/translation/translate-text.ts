/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watsonx-provider-watsonx-v1-translate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { execHttpPostRequest } from '@ibm-aca/aca-wrapper-http';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';

import { IContextV1, IAiTranslationPromptExternalWatsonxV1 } from '@ibm-aiap/aiap--types-server';
import { ITranslateTextParamsV1, IWatsonxV1 } from '../types';

import { getIAMToken } from '../utils';

const PROMPT_TYPES = {
  DEPLOYMENT: 'deployment',
  PROJECT: 'project',
};

const translateText = async (
  watsonx: IWatsonxV1,
  context: IContextV1,
  params: ITranslateTextParamsV1,
) => {
  let prompt;
  let parameters;
  let input;

  let response;
  let requestParams;

  try {
    prompt = params?.aiTranslationPrompt;
    parameters = {
      parameters: params?.parameters || {}
    };
    input = params?.input;

    if (lodash.isEmpty(prompt)) {
      const MESSAGE = 'params.prompt is required!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const IAM_TOKEN = await getIAMToken(watsonx);

    if (
      lodash.isEmpty(watsonx?.url) ||
      lodash.isEmpty(watsonx?.endpoint)
    ) {
      const ERROR_MESSAGE = 'Missing required watsonx.url or watsonx.endpoint parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(IAM_TOKEN)
    ) {
      const ERROR_MESSAGE = 'Missing required IAM Token parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    let requestUrl = watsonx?.url;
    if (prompt.type === PROMPT_TYPES.DEPLOYMENT) {
      requestUrl += `/deployments/${prompt.deploymentName}`;
    }
    requestUrl += watsonx?.endpoint + '?version=' + watsonx?.version;

    const HEADER_AUTHORISATION = `Bearer ${IAM_TOKEN}`;

    const BODY = {
      ...parameters,
    } as IAiTranslationPromptExternalWatsonxV1;

    if (prompt.type === PROMPT_TYPES.PROJECT) {
      BODY.input = input;
      BODY.model_id = prompt.external?.model_id;
      BODY.project_id = prompt.projectId;
    }

    requestParams = {
      url: requestUrl,
      headers: {
        Authorization: HEADER_AUTHORISATION,
        ...watsonx.headers,
      },
      body: BODY,
    };
    response = await execHttpPostRequest({}, requestParams);

    const RET_VAL = response?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params, requestParams, response });
    logger.error(translateText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  translateText,
};
