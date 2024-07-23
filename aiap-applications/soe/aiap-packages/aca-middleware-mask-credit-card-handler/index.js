/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-middleware-mask-credit-card-handler-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

const {
  getUpdateSenderId, getUpdateGAcaProps,
} = require('@ibm-aiap/aiap-utils-soe-update');

const { dataMaskingService, PATTERN_TYPE_CREDIT_CARD } = require('@ibm-aca/aca-data-masking-provider');


//[ersidas.baniulis@ibm.com] - this is not being used anywhere as of 2022-06-27
class MaskCreditCardHandlerWare extends AbstractMiddleware {

  constructor(config) {
    super(
      [
        botStates.NEW, botStates.UPDATE
      ],
      'mask-credit-card-handler-ware',
      middlewareTypes.INCOMING
    );
    this.config = config;
  }

  async executor(bot, update) {
    const UPDATE_SENDER_ID = getUpdateSenderId(update);
    const UPDATE_G_ACA_PROPS = getUpdateGAcaProps(update);
    const UPDATE_G_ACA_PROPS_TENANT_ID = ramda.path(['tenantId'], UPDATE_G_ACA_PROPS);
    try {
      if (
        !lodash.isEmpty(update?.raw?.message?.text)
      ) {
        const MESSAGE_TEXT = update?.raw?.message?.text;
        const OPTIONS = {
          tenantId: UPDATE_G_ACA_PROPS_TENANT_ID,
          patternType: PATTERN_TYPE_CREDIT_CARD,
        };
        const MASKED = dataMaskingService.mask(MESSAGE_TEXT, OPTIONS);
        update.raw.message.text = MASKED;
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  MaskCreditCardHandlerWare,
};
