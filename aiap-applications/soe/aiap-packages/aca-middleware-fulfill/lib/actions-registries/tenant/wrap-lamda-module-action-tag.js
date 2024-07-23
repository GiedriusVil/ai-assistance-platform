/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-fulfill-actions-registry-wrap-lambda-module';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  sendErrorMessage,
} = require('@ibm-aiap/aiap-utils-soe-messages');

const { getUpdateSenderId } = require('@ibm-aiap/aiap-utils-soe-update');

const ON_WRAPPER_CONTROLLER_ERROR_TEXT = 'I am sorry. We are facing tenchnical issues. Please try again later!';

const wrapLambdaModuleActionTag = (params) => {
  try {
    const ACTION_TAG = ramda.path(['actionTag'], params);
    const L_MODULE = ramda.path(['module'], params);
    const L_MODULE_CONFIGURATION = ramda.path(['configuration'], params);
    if (
      lodash.isEmpty(L_MODULE)
    ) {
      const MESSAGE = `Missing required params.module parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ACTION_TAG)
    ) {
      const MESSAGE = `Missing required params.actionTag parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ACTION_TAG_REPLACE = ramda.path(['replace'], ACTION_TAG);
    const ACTION_TAG_SERIES = ramda.path(['series'], ACTION_TAG);
    const ACTION_TAG_EVALUATE = ramda.path(['evaluate'], ACTION_TAG);
    const ACTION_TAG_CONTROLLER = ramda.path(['controller'], ACTION_TAG);

    const WRAPPED_CONTROLLER = async (_params) => {
      const ADAPTER = ramda.path(['bot'], _params);
      const UPDATE = ramda.path(['update'], _params);
      const UPDATE_SENDER_ID = getUpdateSenderId(UPDATE);
      try {
        const TMP_PARAMS = { ..._params, configuration: L_MODULE_CONFIGURATION };
        let retVal = await ACTION_TAG_CONTROLLER(TMP_PARAMS);
        return retVal;
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID, L_MODULE, L_MODULE_CONFIGURATION });
        logger.error('WRAPPED_CONTROLLER', { ACA_ERROR });
        const { logErrorToDatabase } = require('@ibm-aca/aca-auditor-datasource-provider/lib/utils/lambda-modules-error-logger');
        logErrorToDatabase(_params, L_MODULE, ACA_ERROR);
        await sendErrorMessage(ADAPTER, UPDATE, ON_WRAPPER_CONTROLLER_ERROR_TEXT, ACA_ERROR);
      }
    };

    const RET_VAL = {
      replace: ACTION_TAG_REPLACE,
      series: ACTION_TAG_SERIES,
      evaluate: ACTION_TAG_EVALUATE,
      controller: WRAPPED_CONTROLLER,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  wrapLambdaModuleActionTag,
}
