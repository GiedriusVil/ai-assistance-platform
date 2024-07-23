
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-datasource-mongo-jobs-queues-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuid4 } = require('uuid');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, appendDataToError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructUnsetOption } = require('@ibm-aiap/aiap-utils-mongo');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.jobsQueues;

  const PARAMS_JOBS_QUEUES = params?.jobsQueues;
  const PARAMS_JOBS_QUEUES_ID = params?.jobsQueues?.id;

  let isNew = false;
  let jobsQueueId;
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_JOBS_QUEUES_ID)
    ) {
      isNew = true;
      jobsQueueId = uuid4();
    } else {
      jobsQueueId = PARAMS_JOBS_QUEUES_ID;
    }

    if (
      !validator.isMongoId(jobsQueueId) &&
      !validator.isAlphanumeric(jobsQueueId, 'en-US', { ignore: '$_-' })
    ) {
      const ERROR_MESSAGE = 'Invalid params.id attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: {
        $eq: jobsQueueId
      }
    };

    updateOptions = { upsert: true };
    updateCondition = {};
    if (
      !isNew
    ) {
      const PERSISTED_JOBS_QUEUE = await findOneById(datasource, context, { id: jobsQueueId });
      const UNSET_OPTION = constructUnsetOption(PERSISTED_JOBS_QUEUE, PARAMS_JOBS_QUEUES);
      if (
        !lodash.isEmpty(UNSET_OPTION)
      ) {
        updateCondition.$unset = UNSET_OPTION;
      }
    }
    updateCondition.$set = PARAMS_JOBS_QUEUES;
    delete PARAMS_JOBS_QUEUES.id;

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
