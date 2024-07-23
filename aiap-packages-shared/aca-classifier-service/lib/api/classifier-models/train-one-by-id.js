/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-train-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const classifierModelsChangesService = require('../classifier-models-changes');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const trainOneById = async (context, params) => {
  const USER_ID = context?.user?.id;
  const TENANT_ID = context?.user?.session?.tenant?.id;

  const ID = params?.id;
  try {
    const MODEL = await findOneById(context, { id: ID });
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required context.user.session.tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(MODEL)
    ) {
      const MESSAGE = `Unable retrieve classifier model!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const MODEL_CLASSIFIER = MODEL?.classifier;
    const MODEL_CLASSIFIER_INTENTS_IGNORE_LIST = MODEL_CLASSIFIER?.ignoredIntents?.classifier || {};
    const MODEL_CLASSIFIER_TYPE = MODEL_CLASSIFIER?.type;
    const MODEL_CLASSIFIER_CONFIGURATION = MODEL_CLASSIFIER?.configuration;
    if (
      lodash.isEmpty(MODEL_CLASSIFIER_TYPE)
    ) {
      const MESSAGE = `Missing model.classifier.type attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(MODEL_CLASSIFIER_CONFIGURATION)
    ) {
      const MESSAGE = `Missing model.classifier.configuration attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const MODEL_TRAINER_URL = MODEL?.trainerUrl;
    if (
      lodash.isEmpty(MODEL_TRAINER_URL)
    ) {
      const MESSAGE = `Missing model.trainerUrl attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    await classifierModelsChangesService.saveOne(
      context,
      {
        value: {
          id: ID
        },
        action: CHANGE_ACTION.TRAIN_ONE,
      });
    
    const CLASSIFIER_REQUEST_URL = `${MODEL_TRAINER_URL}/api/classifier/train`;
    const CLASSIFIER_REQUEST_BODY = {
      tenantId: TENANT_ID,
      modelId: ID,
      modelType: MODEL_CLASSIFIER_TYPE,
      ignoreList: MODEL_CLASSIFIER_INTENTS_IGNORE_LIST,
      modelConfiguration: MODEL_CLASSIFIER_CONFIGURATION,
    }
    const CLASSIFIER_REQUEST = {
      url: CLASSIFIER_REQUEST_URL,
      body: CLASSIFIER_REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    const TRAINER_RESPONSE = await execHttpPostRequest({}, CLASSIFIER_REQUEST);
    const IS_SUGGESTIONS_ENABLED = MODEL?.suggestionsEnabled;

    if (IS_SUGGESTIONS_ENABLED) {
      const SUGGESTIONS_REQUEST_URL = `${MODEL_TRAINER_URL}/api/suggestions/train`;
      const MODEL_SUGGESTIONS_INTENTS_IGNORE_LIST = MODEL_CLASSIFIER?.ignoredIntents?.suggestions || {};
      const SUGGESTIONS_REQUEST_BODY = {
        tenantId: TENANT_ID,
        modelId: ID,
        ignoreList: MODEL_SUGGESTIONS_INTENTS_IGNORE_LIST
      };
      const SUGGESTIONS_REQUEST = {
        url: SUGGESTIONS_REQUEST_URL,
        body: SUGGESTIONS_REQUEST_BODY,
        options: {
          timeout: 10000
        }
      };
      await execHttpPostRequest({}, SUGGESTIONS_REQUEST);
    }
    const RET_VAL = TRAINER_RESPONSE?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, ID });
    logger.error(trainOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  trainOneById,
}
