/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-dialog-count-is-button`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  getUpdateSessionButtonPayloads,
} = require('@ibm-aiap/aiap-utils-soe-update');

const isButton = (update, message) => {
  const BUTTON_PAYLOADS = getUpdateSessionButtonPayloads(update);
  const MESSAGE_TEXT = ramda.pathOr('', ['message', 'text'], message);

  try {
    let retVal = false;
    if (
      lodash.isArray(BUTTON_PAYLOADS) &&
      !lodash.isEmpty(BUTTON_PAYLOADS)
    ) {
      for (let buttonPayload of BUTTON_PAYLOADS) {
        let buttonPayloadTitle = ramda.path(['title'], buttonPayload);
        let buttonPayloadPayload = ramda.path(['payload'], buttonPayload);
        if (
          !lodash.isEmpty(MESSAGE_TEXT) &&
          !lodash.isEmpty(buttonPayloadTitle) &&
          MESSAGE_TEXT.toLowerCase() === buttonPayloadTitle.toLowerCase()
        ) {
          retVal = true;
          break;
        }
        if (
          !lodash.isEmpty(MESSAGE_TEXT) &&
          !lodash.isEmpty(buttonPayloadPayload) &&
          MESSAGE_TEXT.toLowerCase() === buttonPayloadPayload.toLowerCase()
        ) {
          retVal = true;
          break;
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};



module.exports = {
  isButton,
}
