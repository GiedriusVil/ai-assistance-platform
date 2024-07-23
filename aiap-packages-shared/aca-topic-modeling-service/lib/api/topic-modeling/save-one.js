/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');


const createTopicMinerJob = async (context, topicModel) => {
  const JOB_ID = topicModel?.jobId;
  const USER_ID = context?.user?.id;
  const TENANT_ID = context?.user?.session?.tenant?.id;
  const TOPIC_MINER_URL = topicModel?.topicMinerUrl;
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required context.user.session.tenant.id paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TOPIC_MINER_URL)
    ) {
      const MESSAGE = 'Missing required params.topicModel.topicMinerUrl paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const CREATE_JOB_REQUEST_URL = `${TOPIC_MINER_URL}/api/topic-miner/job/create`;

    const REQUEST_BODY = {
      tenantId: TENANT_ID
    };

    const TOPIC_MINER_REQUEST = {
      url: CREATE_JOB_REQUEST_URL,
      body: REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };

    if (lodash.isEmpty(JOB_ID)) {
      const TOPIC_MINER_RESPONSE = await execHttpPostRequest({}, TOPIC_MINER_REQUEST);
      const TOPIC_MINER_RESPONSE_BODY = TOPIC_MINER_RESPONSE?.body;
      const JOB_ID = TOPIC_MINER_RESPONSE_BODY?.jobId;
      topicModel.jobId = JOB_ID;
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, TOPIC_MINER_URL });
    logger.error('addModelCalculatedDate', { ACA_ERROR });
  }
}

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    await createTopicMinerJob(context, params?.topicModel);
    appendAuditInfo(context, params?.topicModel);
    return await DATASOURCE.topicModels.saveOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
