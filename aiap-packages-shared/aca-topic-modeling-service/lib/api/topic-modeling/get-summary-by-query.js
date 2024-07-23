/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-topic-modeling-get-summary-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaConversationsDatasourceByContext } = require('@ibm-aca/aca-conversations-datasource-provider');


const _retrieveTranscriptData = async (context, params) => {
  const RET_VAL = {
    totalTranscripts: 0,
    totalMessages: 0
  };
  const DATASOURCE = getAcaConversationsDatasourceByContext(context);
  const CONVERSATIONS = await DATASOURCE.conversations.retrieveIdsByQuery(context, params);
  const CONVERSATIONS_IDS = CONVERSATIONS?.ids;
  const CONVERSATIONS_TOTAL = CONVERSATIONS?.total;
  if (!lodash.isEmpty(CONVERSATIONS_IDS)) {
    const PARAMS = {
      conversationsIds: CONVERSATIONS_IDS,
      confidenceRate: params?.filter?.confidenceRate
    };
    const MESSAGES = await DATASOURCE.utterances.findManyByConversationsIds(context, PARAMS);
    const MESSAGES_TOTAL = MESSAGES?.total;
    RET_VAL.totalTranscripts = CONVERSATIONS_TOTAL;
    RET_VAL.totalMessages = MESSAGES_TOTAL;
  }
  return RET_VAL;
}

const getSummaryByQuery = async (context, params) => {
  try {
    const TRANSCRIPT_DATA = await _retrieveTranscriptData(context, params);
    return TRANSCRIPT_DATA;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getSummaryByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getSummaryByQuery
}
