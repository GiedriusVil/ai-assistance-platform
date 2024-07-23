
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-utterances-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {findOneById} = require('./find-one-by-id');

const _sanitizeBeforeSave = (utterance) => {
  delete utterance.id;
};

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.utterances;
  const PARAMS_CONDITIONS = params?.conditions;
  const PARAMS_CONDITIONS_UNSET = PARAMS_CONDITIONS?.unset;

  let filter;
  let updateCondition = {};
  let updateOptions;
  try {
    const UTTERANCE = params?.utterance;
    if (
      lodash.isEmpty(UTTERANCE)
    ) {
      const MESSAGE = `Missing required params.utterance attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ID = ramda.pathOr(uuidv4(), ['id'], UTTERANCE);

    filter = {
      _id: ID
    };
    _sanitizeBeforeSave(UTTERANCE);

    if (
      !lodash.isEmpty(PARAMS_CONDITIONS_UNSET)
    ) {
      updateCondition.$unset = PARAMS_CONDITIONS_UNSET;
    }

    updateCondition.$set = UTTERANCE;

    updateOptions = {
      upsert: true
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    UTTERANCE.id = ID;
    return UTTERANCE;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
};
