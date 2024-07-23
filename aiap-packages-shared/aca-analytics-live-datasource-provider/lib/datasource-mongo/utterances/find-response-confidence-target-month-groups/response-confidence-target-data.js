/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-mongo-utterances-find-response-confidence-target-data-months-group';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _retrieveTargetByPeriod = (options, period) => {
  let targetsByMonth;
  let target;
  try {
    if (
      !lodash.isEmpty(options?.target) &&
      lodash.isNumber(period?.year) &&
      lodash.isNumber(period?.month) &&
      period?.year > 0 &&
      period?.month >= 0 &&
      period?.month <= 12
    ) {
      targetsByMonth = options?.target[`${period?.year}`];
      if (
        !lodash.isEmpty(targetsByMonth) &&
        lodash.isArray(targetsByMonth)
      ) {
        target = targetsByMonth[period?.month - 1];
      }
    }
    const RET_VAL = {
      year: period?.year,
      month: period?.month,
      count: lodash.isNumber(target) ? target : 0,
    };
    return RET_VAL;


  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveTargetByPeriod.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _constructPeriodsByMonth = (startDate, endDate) => {
  const RET_VAL = [];
  try {
    let nextDate = lodash.clone(startDate);
    let year = nextDate.getFullYear();
    let month = nextDate.getMonth();
    RET_VAL.push({
      year: year,
      month: month + 1,
    });
    while (nextDate < endDate) {
      nextDate.setMonth(nextDate.getMonth() + 1);
      year = nextDate.getFullYear();
      month = nextDate.getMonth();
      RET_VAL.push({
        year: year,
        month: month + 1
      });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_constructPeriodsByMonth.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getResponseConfidenceTarget = (params) => {
  const RET_VAL = [];
  let startDate;
  let endDate;
  let options;
  try {
    startDate = params?.dateRangeFrom;
    endDate = params?.dateRangeTo;
    options = params?.options;
    const PERIODS_BY_MONTH = _constructPeriodsByMonth(startDate, endDate);
    PERIODS_BY_MONTH.forEach((period) => {
      let target = _retrieveTargetByPeriod(options, period);
      RET_VAL.push(target);
    });
    return RET_VAL;

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getResponseConfidenceTarget.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getResponseConfidenceTarget
}
