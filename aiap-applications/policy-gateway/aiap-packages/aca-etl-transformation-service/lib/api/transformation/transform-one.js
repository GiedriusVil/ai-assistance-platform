/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-etl-transformation-service-transform-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { jsonata } = require('@ibm-aca/aca-wrapper-jsonata');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const ERR_DOCUMENT_MISSING = () => throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Missing  params.document parameter');
const ERR_TRANSFORMATION_ID_MISSING = () => throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Missing  params.transformation.moduleId parameter');
const ERR_TRANSFORMATION_L_MODULE_MISSING = () => throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Unable to retrieve transformation lambda module!');

const transformOne = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_TRANSFORMATION_MODULE_ID = params?.transformation?.moduleId;
  try {
    if (
      lodash.isEmpty(PARAMS_TRANSFORMATION_MODULE_ID)
    ) {
      ERR_TRANSFORMATION_ID_MISSING();
    }
    if (
      lodash.isEmpty(params?.document)
    ) {
      ERR_DOCUMENT_MISSING();
    }
    const TEMPLATE = await executeEnrichedByLambdaModule(PARAMS_TRANSFORMATION_MODULE_ID, ERR_TRANSFORMATION_L_MODULE_MISSING, context, {});

    const RET_VAL = jsonata(TEMPLATE).evaluate({
      context: context,
      params: params?.document,
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_TRANSFORMATION_MODULE_ID, params });
    logger.error(transformOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  transformOne,
};
