/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service-lib-api-topic-modeling-new-job';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const _generateJob = async (context) => {
  const TOPIC_MINER_URL = context?.user?.session?.tenant?.topicMinerBaseUrl || '';
  const RET_VAL = {
    topicMinerUrl:TOPIC_MINER_URL,
  };

  return RET_VAL;
}

const getNewJob = (context, params) => {
  try {
    const RET_VAL = _generateJob(context);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getNewJob.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getNewJob,
}
