/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes-controller-rules-export';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { rulesToXls } = require('@ibm-aiap/aiap-utils-xlsx');
const { rulesService } = require('@ibm-aca/aca-rules-service');

const exportRules = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = ramda.path(['body'], request);

    const rules = await rulesService.findManyByQuery(CONTEXT, PARAMS);
    const RULE_ITEMS = ramda.path(['items'], rules);

    result = await rulesToXls(RULE_ITEMS);
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=RulesExport.xlsx'
    })
    response.end(result);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  exportRules,
};
