/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-models-execute-job-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);
const { getAcaConversationsDatasourceByContext } = require('@ibm-aca/aca-conversations-datasource-provider');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { JOB_STATUS_MESSAGE } = require('./utils');
const { findOneById } = require('./find-one-by-id');

const checkJobStatus = async (params) => {
  const TOPIC_MINER_URL = params?.topicMinerUrl;
  const TENANT_ID = params?.tenantId;
  const TOPIC_MINER_JOB_ID = params?.jobId;
  const TOPIC_MINER_STATUS_URL = `${TOPIC_MINER_URL}/api/topic-miner/job/get-job`

  try {
    const REQUEST_BODY = {
      tenantId: TENANT_ID,
      jobId: TOPIC_MINER_JOB_ID,
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
    const TOPIC_MINER_JOB_STATUS = TOPIC_MINER_REQUEST_BODY?.job?.status;
    return TOPIC_MINER_JOB_STATUS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, TOPIC_MINER_JOB_ID });
    logger.error(checkJobStatus.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


const addTopicMinerData = async (params) => {
  const TENANT_ID = params?.tenantId;
  const TOPIC_MINER_JOB_ID = params?.jobId;
  const TRANSCRIPT_DATA = params?.transcriptData;
  const TOPIC_MINER_URL = params?.topicMinerUrl;

  try {
    const TOPIC_MODEL_ADD_DATA_URL = `${TOPIC_MINER_URL}/api/topic-miner/job/add-data`;
    
    const TOPIC_MODEL_ADD_DATA_REQUEST_BODY = {
      tenantId: TENANT_ID,
      jobId: TOPIC_MINER_JOB_ID,
      data: TRANSCRIPT_DATA
    }

    const TOPIC_MODEL_ADD_DATA_REQUEST = {
      url: TOPIC_MODEL_ADD_DATA_URL,
      body: TOPIC_MODEL_ADD_DATA_REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    await execHttpPostRequest({}, TOPIC_MODEL_ADD_DATA_REQUEST);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {  TENANT_ID, TOPIC_MINER_JOB_ID });
    logger.error(addTopicMinerData.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const formatMessages = (messages) => {
  let retVal = [];
  if (!lodash.isEmpty(messages)) {
    retVal = messages.map(message => (
      {
        text: message?.text,
        text_id: message?.id,
        metadata: {}
      })
    )
  }
  return retVal;
}

const _retrieveTranscriptData = async (context, params) => {
  try {
    const DATASOURCE = getAcaConversationsDatasourceByContext(context);
    const CONVERSATIONS = await DATASOURCE.conversations.retrieveIdsByQuery(context, params);
    const CONVERSATIONS_IDS = CONVERSATIONS?.ids;
    if (!lodash.isEmpty(CONVERSATIONS_IDS)) {
      const PARAMS = {
        conversationsIds: CONVERSATIONS_IDS,
        confidenceRate: params?.filter?.confidenceRate
      };
      const MESSAGES = await DATASOURCE.utterances.findManyByConversationsIds(context, PARAMS);
      const MESSAGES_TEXTS = MESSAGES?.messages;
      const FORMATTED_MESSAGES = formatMessages(MESSAGES_TEXTS);
      return FORMATTED_MESSAGES;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveTranscriptData.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const executeJobById = async (context, params) => {
  const USER_ID = context?.user?.id;
  const TENANT_ID = context?.user?.session?.tenant?.id;
  const TOPIC_MODEL_ID = params?.id;
  try {
    const TOPIC_MODEL = await findOneById(context, { id: TOPIC_MODEL_ID });
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required context.user.session.tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TOPIC_MODEL)
    ) {
      const MESSAGE = `Unable retrieve topic model!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const TOPIC_MODEL_DATE_RANGE = TOPIC_MODEL?.dateRange;
    const TOPIC_MINER_URL = TOPIC_MODEL?.topicMinerUrl;
    const TOPIC_MINER_JOB_ID = TOPIC_MODEL?.jobId;
    const TOPIC_MINER_CONFIDENCE = TOPIC_MODEL?.confidence;

    if (
      lodash.isEmpty(TOPIC_MODEL_DATE_RANGE)
    ) {
      const MESSAGE = `Missing topicModel.dateRange attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TOPIC_MINER_URL)
    ) {
      const MESSAGE = `Missing topicModel.topicMinerUrl attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TOPIC_MINER_JOB_ID)
    ) {
      const MESSAGE = `Missing required topicModel.jobId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const JOB_STATUS_PARAMS = {
      tenantId: TENANT_ID,
      jobId: TOPIC_MINER_JOB_ID,
      topicMinerUrl: TOPIC_MINER_URL
    }

    const JOB_STATUS = await checkJobStatus(JOB_STATUS_PARAMS);

    if (JOB_STATUS === JOB_STATUS_MESSAGE.NOT_INITIALIZED) {
      const TRANSCRIPT_PARAMS = {
        filter: {
          dateRange: TOPIC_MODEL_DATE_RANGE,
          confidenceRate: TOPIC_MINER_CONFIDENCE
        },
      }
      const TRANSCRIPT_DATA = await _retrieveTranscriptData(context, TRANSCRIPT_PARAMS);

      const TOPIC_MODEL_ADD_DATA_REQUEST_BODY = {
        tenantId: TENANT_ID,
        jobId: TOPIC_MINER_JOB_ID,
        transcriptData: TRANSCRIPT_DATA,
        topicMinerUrl: TOPIC_MINER_URL
      }
      await addTopicMinerData(TOPIC_MODEL_ADD_DATA_REQUEST_BODY)

    }

    const TOPIC_MODEL_START_JOB_URL = `${TOPIC_MINER_URL}/api/topic-miner/job/start`;
    const TOPIC_MODEL_START_JOB_REQUEST_BODY = {
      tenantId: TENANT_ID,
      jobId: TOPIC_MINER_JOB_ID,
    }
    const TOPIC_MODEL_START_JOB_REQUEST = {
      url: TOPIC_MODEL_START_JOB_URL,
      body: TOPIC_MODEL_START_JOB_REQUEST_BODY,
      options: {
        timeout: 10000
      }
    };
    const TOPIC_MODEL_START_JOB = await execHttpPostRequest({}, TOPIC_MODEL_START_JOB_REQUEST);

    const RET_VAL = TOPIC_MODEL_START_JOB?.body;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, TENANT_ID, TOPIC_MODEL_ID });
    logger.error(executeJobById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  executeJobById,
}
