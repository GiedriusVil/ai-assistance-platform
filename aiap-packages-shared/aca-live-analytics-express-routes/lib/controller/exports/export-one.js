/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-express-routes-exports-export-one'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { liveAnalyticsQueriesService } = require('@ibm-aca/aca-live-analytics-queries-service');

const convertArrayOfObjectsToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',') + '\n';

  const rows = data.map((item) => {
    return headers.map((key) => {
      const value = item[key] != null ? item[key].toString().replace(/"/g, '""') : '';
      const shouldWrapInQuotes = value.startsWith('_') || value.includes(',');
      return shouldWrapInQuotes ? `"${value}"` : value;
    }).join(',');
  });

  const csv = headerRow + rows.join('\n');
  return csv;
}

const exportOne = async (request, response) => {
  const ERRORS = [];
  let context;
  let params;
  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    params = request?.body;
    if (lodash.isEmpty(params)) {
      const MESSAGE = `Missing required value request.body`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(ERRORS)) {
      retVal = await liveAnalyticsQueriesService.executeOne(context, params);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { context, params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error(exportOne.name, { ERRORS });
    response.status(500).json(ERRORS);
  } else {
    response.set('Content-Type', 'text/csv');
    const CSV_DATA = convertArrayOfObjectsToCSV(retVal);
    response.status(200).send(CSV_DATA);
  }
};

module.exports = {
  exportOne,
};
