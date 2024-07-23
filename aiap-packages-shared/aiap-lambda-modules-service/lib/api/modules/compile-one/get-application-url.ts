/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-compile-one-get-application-url';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { formatIntoAcaError, appendDataToError } from '@ibm-aca/aca-utils-errors';

import {
  ILambdaModulesGetApplicationUrl
} from '../../../types';

const LAMBDA_MODULE_TYPES_SOE = {
  ACTION_TAG: 'ACTION_TAG',
  MS_TEAMS_CARD: 'MS_TEAMS_CARD',
  SLACK_COMPONENT: 'SLACK_COMPONENT',
  SOE_MIDDLEWARE: 'SOE_MIDDLEWARE',
}

const LAMBDA_MODULE_TYPES_TENANT_CUSTOMIZER = {
  JOB_EXECUTOR: 'JOB_EXECUTOR',
  TENANT_CUSTOMIZER_SERVICE: 'TENANT_CUSTOMIZER_SERVICE',
}

const BASE_URL_PATHS = {
  CHAT_APP: 'chatAppBaseUrl',
  SOE: 'soeBaseUrl',
  TENANT_CUSTOMIZER: 'tenantCustomizerBaseUrl',
}



const getApplicationUrl = (
  context: IContextV1, 
  params: ILambdaModulesGetApplicationUrl
  ) => {
  try {
    const TYPE = params?.type;
    let baseUrl: string | { data: any };
    switch (TYPE) {
      case LAMBDA_MODULE_TYPES_SOE.ACTION_TAG:
      case LAMBDA_MODULE_TYPES_SOE.MS_TEAMS_CARD:
      case LAMBDA_MODULE_TYPES_SOE.SLACK_COMPONENT:
      case LAMBDA_MODULE_TYPES_SOE.SOE_MIDDLEWARE:
        baseUrl = getBaseUrl(context, params, BASE_URL_PATHS.SOE);
        break;
      case LAMBDA_MODULE_TYPES_TENANT_CUSTOMIZER.JOB_EXECUTOR:
      case LAMBDA_MODULE_TYPES_TENANT_CUSTOMIZER.TENANT_CUSTOMIZER_SERVICE:
        baseUrl = getBaseUrl(context, params, BASE_URL_PATHS.TENANT_CUSTOMIZER);
        break;
      default:
        baseUrl = getBaseUrl(context, params, BASE_URL_PATHS.CHAT_APP);
        break;
    }
    return baseUrl;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getApplicationUrl.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getBaseUrl = (context: IContextV1, params, baseUrlPath: string): string | { data: any } => {
  const HOSTNAME = context?.user?.session?.tenant[baseUrlPath];
  if (lodash.isEmpty(HOSTNAME)) {
    const ACA_ERROR = formatIntoAcaError(
      MODULE_ID,
      `${baseUrlPath} was not found!`);
    logger.error(getBaseUrl.name, { ACA_ERROR, params });
    appendDataToError(ACA_ERROR, { basePathError: true });
    return ACA_ERROR;
  }
  return `${HOSTNAME}/api/v1/lambda-modules/compile`;
}

export {
  getApplicationUrl,
}
