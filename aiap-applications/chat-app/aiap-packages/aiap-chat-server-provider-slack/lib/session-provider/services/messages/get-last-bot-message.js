/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-adapter-slack-services-messages-get-last-bot-message';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { findLastBotMessage } = require('./find-last-bot-message');

const getLastBotMessage = async (params) => {
  try {
    const G_ACA_PROPS = ramda.path(['gAcaProps'], params);
    const MESSAGE = ramda.path(['message'], params);
    const CONTEXT = {
      gAcaProps: G_ACA_PROPS,
      message: MESSAGE,
    };
    const RET_VAL = await findLastBotMessage(CONTEXT, {});
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getLastBotMessage
}
