/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');

const importManyFromFile = async (request, response) => {
  const ERRORS = [];
  let result;

  try {
    const FILE = ramda.path(['file'], request);
    if (lodash.isEmpty(FILE)) {
      ERRORS.push({
        error: 'MISSING_FILE',
        message: 'File was not attached!'
      });
    }
    if (ramda.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        file: FILE,
      };
      result = await lambdaModulesService.importMany(CONTEXT, PARAMS);
    }
  } catch (error) {
    ERRORS.push(error);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }

};

module.exports = {
  importManyFromFile,
};
