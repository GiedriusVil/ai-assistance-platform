/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');


const addModelStatus = async (context, model) => {
  const USER_ID = context?.user?.id;
  const TENANT_ID = context?.user?.session?.tenant?.id;
  const ID = model?.id;
  const TRAINER_URL = model?.trainerUrl;
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required context.user.session.tenant.id paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = 'Missing required model.id paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TRAINER_URL)
    ) {
      const MESSAGE = 'Missing required model.trainerUrl paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const CLASSIFIER_REQUEST_URL = `${TRAINER_URL}/api/classifier/status`;
    const SUGGESTIONS_REQUEST_URL = `${TRAINER_URL}/api/suggestions/status`;

    const REQUEST_BODY = {
      tenantId: TENANT_ID,
      modelId: ID,
    }
    const CLASSIFIER_REQUEST = {
      url: CLASSIFIER_REQUEST_URL,
      body: REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    const SUGGESTIONS_REQUEST = {
      url: SUGGESTIONS_REQUEST_URL,
      body: REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    const CLASSIFIER_RESPONSE = await execHttpPostRequest({}, CLASSIFIER_REQUEST);
    const CLASSIFIER_RESPONSE_BODY = CLASSIFIER_RESPONSE?.body;

    const SUGGESTIONS_RESPONSE = await execHttpPostRequest({}, SUGGESTIONS_REQUEST);
    const SUGGESTIONS_RESPONSE_BODY = SUGGESTIONS_RESPONSE?.body;

    const META_DATA = CLASSIFIER_RESPONSE_BODY?.metadata;
    const META_DATA_TIMESTAMP = META_DATA?.timestamp;

    model.metadata = META_DATA;

    const CLASSIFIER_STATUS_VALUE = ramda.pathOr('N/A', ['status'], CLASSIFIER_RESPONSE_BODY);
    const SUGGESTIONS_STATUS_VALUE = ramda.pathOr('N/A', ['status'], SUGGESTIONS_RESPONSE_BODY);


    model.status = {
      classifierValue: CLASSIFIER_STATUS_VALUE,
      suggestionsValue: SUGGESTIONS_STATUS_VALUE
    };
    if (
      META_DATA_TIMESTAMP
    ) {
      try {
        model.status.date = new Date(META_DATA_TIMESTAMP * 1000).toISOString();
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, ID, TRAINER_URL });
        logger.error('addModelCalculatedDate', { ACA_ERROR });
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, ID, TRAINER_URL });
    logger.error('addModelCalculatedDate', { ACA_ERROR });
    model.status = { value: 'Unable to retrie status!', error: ACA_ERROR };
  }
}

const findManyByQuery = async (context, params) => {
  const USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.classifier.findManyByQuery(context, params);
    const MODELS = RET_VAL?.items;

    if (
      lodash.isArray(MODELS) &&
      !lodash.isEmpty(MODELS)
    ) {
      const PROMISES = [];
      for (let model of MODELS) {
        PROMISES.push(addModelStatus(context, model));
      }
      await Promise.all(PROMISES);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
