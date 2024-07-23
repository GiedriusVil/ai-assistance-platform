/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-models-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');


const addTopicModelStatus = async (context, topicModel) => {
  const USER_ID = context?.user?.id;
  const TENANT_ID = context?.user?.session?.tenant?.id;
  const JOB_ID = topicModel?.jobId;
  const TOPIC_MINER_URL = topicModel?.topicMinerUrl;
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required context.user.session.tenant.id paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(JOB_ID)
    ) {
      const MESSAGE = 'Missing required topicModel.jobId paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TOPIC_MINER_URL)
    ) {
      const MESSAGE = 'Missing required topicModel.topicMiner paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const TOPIC_MINER_STATUS_URL = `${TOPIC_MINER_URL}/api/topic-miner/job/get-job`;

    const REQUEST_BODY = {
      tenantId: TENANT_ID,
      jobId: JOB_ID,
    }
    const TOPIC_MINER_REQUEST = {
      url: TOPIC_MINER_STATUS_URL,
      body: REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    
    const TOPIC_MINER_STATUS_REQUEST = await execHttpPostRequest({}, TOPIC_MINER_REQUEST);
    const TOPIC_MINER_REQUEST_BODY = TOPIC_MINER_STATUS_REQUEST?.body;

    const TOPIC_MINER_JOB = TOPIC_MINER_REQUEST_BODY?.job;
    const TOPIC_MINER_JOB_STATUS = TOPIC_MINER_JOB?.status;
    const TOPIC_MINER_JOB_STATUS_MESSAGE= TOPIC_MINER_JOB?.status_message;
    const TOPIC_MINER_JOB_STARTED_DATE = TOPIC_MINER_JOB?.started;
    const TOPIC_MINER_JOB_ENDED_DATE = TOPIC_MINER_JOB?.ended;
    const TOPIC_MINER_JOB_DURATION = TOPIC_MINER_JOB?.duration;

    topicModel.jobStatus = {
      status: TOPIC_MINER_JOB_STATUS,
      statusMessage: TOPIC_MINER_JOB_STATUS_MESSAGE,
      started: TOPIC_MINER_JOB_STARTED_DATE,
      ended: TOPIC_MINER_JOB_ENDED_DATE,
      duration:TOPIC_MINER_JOB_DURATION
    };

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, JOB_ID, TOPIC_MINER_URL });
    logger.error('addModelCalculatedDate', { ACA_ERROR });
    topicModel.jobStatus = { status: 'Unable to retrieve status!', error: ACA_ERROR };
  }
}

const findManyByQuery = async (context, params) => {
  const USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.topicModels.findManyByQuery(context, params);
    const TOPIC_MODELS = RET_VAL?.items;

    if (
      lodash.isArray(TOPIC_MODELS) &&
      !lodash.isEmpty(TOPIC_MODELS)
    ) {
      const PROMISES = [];
      for (let topicModel of TOPIC_MODELS) {
        PROMISES.push(addTopicModelStatus(context, topicModel));
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
