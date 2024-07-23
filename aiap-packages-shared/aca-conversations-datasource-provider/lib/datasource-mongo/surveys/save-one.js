/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-surveys-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const _sanitizeBeforeSave = (survey) => {
  delete survey.id;
}

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.surveys;

  let filter;
  let updateCondition;
  let updateOptions;
  try {
    const SURVEY = ramda.path(['survey'], params);
    if (
      lodash.isEmpty(SURVEY)
    ) {
      const MESSAGE = `Missing required params.survey attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const IS_NEW = lodash.isEmpty(ramda.path(['id'], SURVEY));
    const ID = ramda.pathOr(uuidv4(), ['id'], SURVEY);
    if (IS_NEW) {
      SURVEY.created = new Date();
    }
    filter = {
      _id: ID
    };
    _sanitizeBeforeSave(SURVEY);
    updateCondition = {
      $set: SURVEY
    };
    updateOptions = {
      upsert: true
    }
    logger.info('->', {
      filter,
    });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    SURVEY.id = ID;
    return SURVEY;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
