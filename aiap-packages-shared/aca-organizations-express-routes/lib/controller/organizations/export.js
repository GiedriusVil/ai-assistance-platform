/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-express-routes-controller-export';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { organizationsToExcel } = require('@ibm-aiap/aiap-utils-xlsx');
const { organizationsService } = require('@ibm-aca/aca-organizations-service');

const exportOrganizations = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = request?.body;

    const RESPONSE = await organizationsService.findManyByQuery(CONTEXT, PARAMS);
    const ORGANIZATIONS = RESPONSE?.items;

    result = await organizationsToExcel(ORGANIZATIONS);
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=OrganizationsExport.xlsx'
    })
    response.end(result);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  exportOrganizations,
};
