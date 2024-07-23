/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-08-31-utterances-transform-record';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ensureChannelMeta } = require('./ensure-channel-meta');

const transformRecord = (conversation) => {

  try {

    conversation._processed_2022_11_16 = true;

    ensureChannelMeta(conversation);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(transformRecord.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transformRecord,
}
