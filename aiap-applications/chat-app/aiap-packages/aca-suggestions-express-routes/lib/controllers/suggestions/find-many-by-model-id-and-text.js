/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-suggestions-express-routes-controllers-find-many-by-id-and-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { suggestionsService } = require('@ibm-aca/aca-suggestions-service');

const findManyByModelIdAndText = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const REQUEST_BODY = request?.body;
    const G_ACA_PROPS = REQUEST_BODY?.gAcaProps;
    const CLASSIFIER_MODEL_ID = REQUEST_BODY?.classifierModelId;
    const INPUT_TEXT = REQUEST_BODY?.inputText;
    const SUGGESTIONS_COUNT = REQUEST_BODY?.suggestionsCount;
    if (lodash.isEmpty(G_ACA_PROPS)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.gAcaProps paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(CLASSIFIER_MODEL_ID)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.classifierModelId paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }
    if (lodash.isEmpty(INPUT_TEXT)) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.inputText paramater!`,
      };
      ERRORS.push(ACA_ERROR);
    }

    const CONTEXT = {
      gAcaProps: G_ACA_PROPS
    };

    const PARAMS = {
      classifierModelId: CLASSIFIER_MODEL_ID,
      inputText: INPUT_TEXT,
      suggestionsCount: SUGGESTIONS_COUNT
    };

   result = await suggestionsService.findManyByModelIdAndText(CONTEXT, PARAMS);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { ERRORS });
    response.json({errors: ERRORS });
  }
};

module.exports = {
  findManyByModelIdAndText,
};
