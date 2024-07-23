/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-11-16-utterances-create-ticket-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ensureMetricsTracker } = require('./ensure-metrics-tracker');

const transformRecord = (utterance) => {

  try {

    utterance._processed_2022_11_16 = true;

    ensureMetricsTracker(utterance);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(transformRecord.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transformRecord,
}
