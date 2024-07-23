/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-models-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);


const _retrieveTopics = async(context, params) => {
  const TENANT_ID = context?.user?.session?.tenant?.id;
  const TOPIC_MINER_BASE_URL = context?.user?.session?.tenant?.topicMinerBaseUrl;
  const JOB_ID = params?.jobId;
  const TOPIC_MINER_TOPICS_URL = `${TOPIC_MINER_BASE_URL}/api/topic-miner/result/get-topics`;
  try {

    if (
      lodash.isEmpty(TOPIC_MINER_BASE_URL)
    ) {
      const MESSAGE = `Missing tenant.topicMinerUrl attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(JOB_ID)
    ) {
      const MESSAGE = `Missing params.jobId attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing tenant.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const REQUEST_BODY = {
      tenantId: TENANT_ID,
      jobId: JOB_ID,
    }
    const TOPIC_MINER_RETRIEVE_TOPICS_REQUEST = {
      url: TOPIC_MINER_TOPICS_URL,
      body: REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    const TOPICS = await execHttpPostRequest({}, TOPIC_MINER_RETRIEVE_TOPICS_REQUEST);
    const RET_VAL = {
      items: TOPICS?.body?.result
    }
    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveTopics.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

const findTopicsByJobId = async (context, params) => {
  try {
    const RET_VAL = await _retrieveTopics(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findTopicsByJobId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findTopicsByJobId,
}
