/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-express-routes-controller-audits-generate-report';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { docValidationAuditsService } = require('@ibm-aca/aca-doc-validation-service');
const { transactionsToXls } = require('@ibm-aiap/aiap-utils-xlsx');

const generateReport = async (request, response) => {
  const ERRORS = [];

  let context;
  let contextUserId;

  let params;
  let result;
  try {
    context = request?.acaContext;
    contextUserId = context?.user?.id;
    if (
      lodash.isEmpty(context)
    ) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = request?.body;
    const TRANSACTIONS = await docValidationAuditsService.transactionsByQuery(context, params);

    result = await transactionsToXls(context, TRANSACTIONS);
    if (
      lodash.isEmpty(result)
    ) {
      const MESSAGE = `Unable to retrieve any data for export!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=TransactionsReport.xlsx'
    })
    response.end(result);
  } else {
    logger.error(`${generateReport.name}`, { errors: ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  generateReport,
};
