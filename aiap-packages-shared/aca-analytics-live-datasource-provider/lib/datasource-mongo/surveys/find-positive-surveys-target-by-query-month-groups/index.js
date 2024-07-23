/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-surveys-find-positive-surveys-by-query-target-month-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getPositiveSurveysTarget } = require('./positive-surveys-target-data');

const findPositiveSurveysTargetByQueryMonthGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let dateRangeFrom;
  let dateRangeTo;
  let options;
  try {
    dateRangeFrom = params?.query?.filter?.dateRange?.from;
    dateRangeTo = params?.query?.filter?.dateRange?.to;
    options = params?.query?.options;
    if (
      !lodash.isDate(dateRangeFrom)
    ) {
      const ERROR_MESSAGE = `Wrong type of required params?.query?.filter?.dateRange?.from parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isDate(dateRangeFrom)
    ) {
      const ERROR_MESSAGE = `Wrong type of required params?.query?.filter?.dateRange?.to parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL = getPositiveSurveysTarget({ options, dateRangeFrom, dateRangeTo });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(findPositiveSurveysTargetByQueryMonthGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findPositiveSurveysTargetByQueryMonthGroups
}
