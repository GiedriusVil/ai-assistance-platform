/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-suggestions-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');

const { getAcaClassifierDatasourceByTenant } = require('@ibm-aca/aca-classifier-datasource-provider');

const { execHttpPostRequest } = require('@ibm-aca/aca-wrapper-http');

const findManyByModelIdAndText = async (context, params) => {
  try {
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    const TENANT_ID = context?.gAcaProps?.tenantId;
    const TENANT_HASH = context?.gAcaProps?.tenantHash;
    const CLASSIFIER_MODEL_ID = params?.classifierModelId;
    const SUGGESTIONS_COUNT = params?.suggestionsCount;
    const INPUT_TEXT = params?.inputText;
    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash({
      id: TENANT_ID,
      hash: TENANT_HASH
    });

    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing tenant!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const DATASOURCE = getAcaClassifierDatasourceByTenant(TENANT);
    const CLASSIFIER_MODEL = await DATASOURCE.classifier.findOneById(context, { id: CLASSIFIER_MODEL_ID });

    if (
      lodash.isEmpty(CLASSIFIER_MODEL)
    ) {
      const MESSAGE = `Missing classifier model!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const CLASSIFIER_SERVICE_URL = CLASSIFIER_MODEL?.serviceUrl;
    const REQUEST_URL = `${CLASSIFIER_SERVICE_URL}/api/suggestions/predict`
    const POST_REQUEST_OPTIONS = {
      url: REQUEST_URL,
      body: {
        tenantId: TENANT_ID,
        modelId: CLASSIFIER_MODEL_ID,
        text: INPUT_TEXT,
        count: SUGGESTIONS_COUNT
      },
      options: {
        timeout: {
          request: 3000
        },
        retry: 1
      }
    };
    const SUGGESTIONS = await execHttpPostRequest({}, POST_REQUEST_OPTIONS);
    const RET_VAL = SUGGESTIONS?.body?.results;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyByModelIdAndText,
};
