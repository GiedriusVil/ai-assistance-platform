/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import { execHttpPostRequest } from '@ibm-aca/aca-wrapper-http';

import { getDatasourceByContext } from '../datasource.utils';
import { getApplicationUrl } from '../modules/compile-one/get-application-url';
import { getAcaAnswersDatasourceByContext } from '@ibm-aca/aca-answers-datasource-provider';
import { getAiServicesDatasourceByContext } from '@ibm-aiap/aiap-ai-services-datasource-provider';

import {
  IFindLambdaModulesByQueryParamsV1
} from '../../types';

const retrieveAnswersAndSkillsByLambdaModuleId = async (context: IContextV1, lambdaModules) => {
  try {
    const LAMBDA_MODULES_ITEMS = lambdaModules?.items;
    const PROMISES = [];
    for (const lambdaModule of LAMBDA_MODULES_ITEMS) {
      PROMISES.push(retrieveAnswerAndSkillByActionTagId(context, lambdaModule));
    }
    const LAMBDA_MODULES_WITH_ANSWERS_AND_SKILLS = await Promise.all(PROMISES);
    const RET_VAL = {
      items: LAMBDA_MODULES_WITH_ANSWERS_AND_SKILLS,
      ...lambdaModules
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAnswersAndSkillsByLambdaModuleId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const retrieveAnswerAndSkillByActionTagId = async (context: IContextV1, lambdaModule) => {
  try {
    if (lambdaModule.type === 'ACTION_TAG') {
      const PROMISES = [];
      const ANSWERS_DATASOURCE = getAcaAnswersDatasourceByContext(context);
      const AI_SERVICE_DATASOURCE = getAiServicesDatasourceByContext(context);
      const PARAMS = {
        moduleId: lambdaModule.id
      };
      PROMISES.push(ANSWERS_DATASOURCE.answers.findManyByActionTagId(context, PARAMS));
      PROMISES.push(AI_SERVICE_DATASOURCE.aiSkills.findManyByActionTagId(context, PARAMS));
      const DATA = await Promise.all(PROMISES);
      const ANSWERS = DATA[0];
      const SKILLS = DATA[1];
      lambdaModule.answers = ANSWERS;
      lambdaModule.skills = SKILLS;
    } else {
      lambdaModule.answers = [];
      lambdaModule.skills = [];
    }
    return lambdaModule;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAnswerAndSkillByActionTagId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findManyByQuery = async (
  context: IContextV1, 
  params: IFindLambdaModulesByQueryParamsV1
  ) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const LAMBDA_MODULES = await DATASOURCE.modules.findManyByQuery(context, params);
    const LAMBDA_MODULES_WITH_HEALTHCECKS = await performLambdaModulesHealthCheck(context, LAMBDA_MODULES);
    const RESPONSE = await retrieveAnswersAndSkillsByLambdaModuleId(context, LAMBDA_MODULES_WITH_HEALTHCECKS);
    return RESPONSE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const performLambdaModulesHealthCheck = async (context: IContextV1, lambdaModules) => {
  const RET_VAL = [];
  const LAMBDA_MODULES_ITEMS = lambdaModules?.items;
  const SESSION_TENANT = context?.user?.session?.tenant;
  const SOE_BASE_URL = SESSION_TENANT?.soeBaseUrl;
  const CHAT_APP_BASE_URL = SESSION_TENANT?.chatAppBaseUrl;
  const TENANT_CUSTOMIZER_BASE_URL = SESSION_TENANT?.tenantCustomizerBaseUrl;
  const COMPILED_PROMISE = [];
  try {
    if (
      lodash.isEmpty(SOE_BASE_URL) &&
      lodash.isEmpty(CHAT_APP_BASE_URL) &&
      lodash.isEmpty(TENANT_CUSTOMIZER_BASE_URL)
    ) {
      return lambdaModules;
    } else {
      for (let lambdaModule of LAMBDA_MODULES_ITEMS) {
        const URL = getApplicationUrl(context, lambdaModule);
        if ((URL as { data: any })?.data?.basePathError) {
          COMPILED_PROMISE.push(URL);
        } else {
          COMPILED_PROMISE.push(sendRequestToApp(URL as string, lambdaModule));
        }
      }
      const RESOLVED_MODULES = await Promise.all(COMPILED_PROMISE);
      if (lodash.isArray(RESOLVED_MODULES) && !lodash.isEmpty(RESOLVED_MODULES)) {
        RET_VAL.push(...RESOLVED_MODULES);
        lambdaModules.healthCheck = RET_VAL;
        return lambdaModules;
      } else {
        return lambdaModules;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(performLambdaModulesHealthCheck.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const sendRequestToApp = async (url: string, lambdaModule) => {
  try {
    const LAMBDA_MODULE_ID = lambdaModule?.id;
    const LAMBDA_MODULE_CODE = lambdaModule?.code;
    const TIMEOUT = 2000;
    const RETRY = 2;
    const REQUEST_OPTIONS = {
      url: url,
      body: {
        id: LAMBDA_MODULE_ID,
        code: LAMBDA_MODULE_CODE
      },
      options: {
        timeout: TIMEOUT,
        retry: RETRY,
      },
    };
    logger.info('REQUEST:', {
      options: REQUEST_OPTIONS
    });
    const RESPONSE = await execHttpPostRequest({}, REQUEST_OPTIONS);
    return RESPONSE.body;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { apiError: true });
    logger.error(sendRequestToApp.name, { ACA_ERROR });
    return ACA_ERROR;
  }

}

export {
  findManyByQuery,
}
