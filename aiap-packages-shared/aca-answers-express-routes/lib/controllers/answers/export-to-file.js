/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-server-controllers-answers-export-many-to-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const moment = require('moment');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { answersService } = require('@ibm-aca/aca-answers-service');



const exportToFile = async (req, res) => {
  const ERRORS = [];
  let result;

  try {
    const ANSWER_STORE_ID = ramda.path(['params', 'answerStoreId'], req);
    if (lodash.isEmpty(ANSWER_STORE_ID)) {
      ERRORS.push({
        error: 'ANSWER_STORE_ID',
        message: 'Missing answer store ID'
      });
      logger.error('ERROR: Missing answer store ID');
    }

    if (!lodash.isEmpty(ERRORS)) {
      res.status(400).json(ERRORS);
    }
    const CONTEXT = constructActionContextFromRequest(req);
    const PARAMS = {
      id: ANSWER_STORE_ID,
    };
    const DATA = await answersService.exportMany(CONTEXT, PARAMS);
    result = sanitizeId(DATA);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (
    !lodash.isEmpty(ERRORS)
  ) {
    res.status(500).json(ERRORS);
  } else {
    res.setHeader('Content-disposition', 'attachment; filename=answerstore_' + moment().format() + '.json');
    res.set('Content-Type', 'application/json');
    res.status(200).json(result);
  }

};

const sanitizeId = (data) => {
  let result = [];
  for (let answer of data.answers) {
    if (!lodash.isEmpty(answer.id)) {
      delete answer.id
    }
    result.push(answer);
  }
  return result;
}

module.exports = {
  exportToFile,
};
