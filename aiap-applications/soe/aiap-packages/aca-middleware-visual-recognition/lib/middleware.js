/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-virtual-recognition-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

// const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
// const { sendErrorMessage } = require('@ibm-aiap/aiap-utils-soe-messages');

const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');

// const ON_ERROR_MESSAGE = `[ERROR_NOTIFICATION] ${MODULE_ID}`;

class VisualRecognitionWare extends AbstractMiddleware {

  constructor(configuration) {
    super(
      [
        botStates.UPDATE, botStates.NEW
      ],
      'visual-recognition-ware',
      middlewareTypes.INCOMING
    );
    this.config = configuration;
  }

  async executor(bot, update) {
    // try {
    //   if (update.attachment) {
    //     const headers = {};
    //     const construct = {
    //       url: this.config.url,
    //       version: this.config.version,
    //     };

    //     if (this.config.api_key) {
    //       construct.api_key = this.config.api_key;
    //     }
    //     if (this.config.iam_apikey) {
    //       construct.iam_apikey = this.config.iam_apikey;
    //     }

    //     const visualRecognition = new VisualRecognitionV3(construct);

    //     if (this.config.no_learning) {
    //       headers['X-Watson-Learning-Opt-Out'] = true;
    //     }
    //     if (update.customerId) {
    //       headers['X-Watson-Metadata'] = `customer_id=${update.customerId}`;
    //     }

    //     const params = {
    //       url: update.attachment.url,
    //       headers,
    //     };

    //     if (this.config.threshold) {
    //       params.threshold = this.config.threshold;
    //     }
    //     if (this.config.accept_language) {
    //       params.accept_language = this.config.accept_language;
    //     }
    //     if (this.config.owners) {
    //       params.owners = this.config.owners;
    //     } else if (this.config.classifier_ids) {
    //       params.classifier_ids = this.config.classifier_ids;
    //     }
    //     logger.debug('[WVR] Request', {
    //       params,
    //     });

    //     visualRecognition.classify(params, function (err, res) {
    //       if (err) {
    //         logger.error('[WVR] Error calling Watson Visual Recognition Service', err);
    //         update.raw.message.text = 'WVR_FAILED';
    //         return;
    //       } else {
    //         logger.debug('[WVR] Response', res);
    //         update.raw.message.text = 'WVR_REFINE';
    //         update.session.context.wvr = res;
    //         return;
    //       }
    //     });
    //   } else {
    //     return;
    //   }
    // } catch (error) {
    //   const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    //   logger.error('executor', { ACA_ERROR });
    //   sendErrorMessage(bot, update, ON_ERROR_MESSAGE, ACA_ERROR);
    //   return 'cancel';
    // }
  }
}

module.exports = {
  VisualRecognitionWare,
};
