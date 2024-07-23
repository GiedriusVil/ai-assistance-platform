/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-server-controllers-answers-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answersService } = require('@ibm-aca/aca-answers-service');


const importManyFromFile = async (request, response) => {
  const ERRORS = [];
  let result;

  try {
    const ANSWER_STORE_ID = ramda.path(['params', 'answerStoreId'], request);
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
        id: ANSWER_STORE_ID,
        file: FILE,
      };
      result = await answersService.importMany(CONTEXT, PARAMS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    !lodash.isEmpty(ERRORS)
  ) {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  } else {
    response.status(200).json(result);
  }

};

module.exports = {
  importManyFromFile,
};
