/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-telia-ace-provider-channel-client-utils-transform-transcript-to-batch';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const DEFAULT_MAX_MESSAGE_LENGTH = 1024;

//TODO: add length through Engagement config
const transformTranscriptToBatch = (message: string, length?: number) => {
  const MAX_MESSAGE_LENGTH = length ? length : DEFAULT_MAX_MESSAGE_LENGTH;

  try {
    let batch = [];
    const STRING_SIZE_IN_BYTES = new Blob([message]).size;

    if (STRING_SIZE_IN_BYTES > MAX_MESSAGE_LENGTH) {
      const DIVIDE_BY = Math.ceil( STRING_SIZE_IN_BYTES / MAX_MESSAGE_LENGTH );

      const LENGTH_OF_BATCH = Math.ceil( message.length / DIVIDE_BY);
      const RGXP_STRING = `.{1,${LENGTH_OF_BATCH}}`;
      const RGXP = new RegExp(RGXP_STRING, 'g');

      batch = message.match(RGXP); 
    } else {
      batch.push(message);
    }

    return batch;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(MODULE_ID, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  transformTranscriptToBatch
}
