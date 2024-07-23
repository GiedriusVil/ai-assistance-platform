/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-service-ai-search-and-analysis-services-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const saveOne = async (context, params) => {
  const USER_ID = context?.user?.id;

  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiSearchAndAnalysisServices.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
};
