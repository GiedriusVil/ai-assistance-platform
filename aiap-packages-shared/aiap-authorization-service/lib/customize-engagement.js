/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-customize-engagement';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _customizeEngagement = async (context, params) => {
  logger.debug(_customizeEngagement.name, 'Engagement customizer is not implemented. Engagement will not be customized.')
  const RET_VAL = params?.session?.engagement;
  return RET_VAL;
}

const customizeEngagement = async (context, params) => {
  try {
    const PARAMS = lodash.cloneDeep(params);
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _customizeEngagement, context, PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(customizeEngagement.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  customizeEngagement,
}
