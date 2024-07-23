/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record-ensure-ai-service-request';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const ensureMetricsTracker = (utterance) => {
  try {

    let metricsTracker = utterance?.metricsTracker;

    if (
      lodash.isEmpty(metricsTracker)
    ) {
      metricsTracker = {
        transferToAgent: {
          isTransfered: true
        }
      };
    }
    utterance._processed_2022_11_16 = true;
    utterance.metricsTracker = metricsTracker;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureMetricsTracker.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureMetricsTracker,
}
