/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-service-doc-validation-v2-validate-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { validateOne } = require('./validate-one');

const validateMany = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let documents;
  try {
    documents = params?.documents;
    if (
      lodash.isEmpty(documents)
    ) {
      const MESSAGE = `Missing required params.documents parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(documents)
    ) {
      const MESSAGE = `Wrong type of params.documents parameter! [Expected: Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PROMISES = [];
    for (let document of documents) {
      PROMISES.push(validateOne(context, { document }));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(validateMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateMany,
}
