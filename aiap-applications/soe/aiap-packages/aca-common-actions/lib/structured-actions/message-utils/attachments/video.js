/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-actions-structured-actions-message-utils-attachments-video';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');


const formatters = require('./formatters/index');

const transform = (attachment, attributes) => {
  try {
    const ATTACHMENTS = ramda.path(['attachments'], attachment);
    const RET_VAL = {
      type: 'video',
      attachments: [],
    };
    if (
      Array.isArray(ATTACHMENTS) &&
      ATTACHMENTS.length > 0
    ) {
      const RESULT = formatters.videos.format(ATTACHMENTS);
      if (RESULT.videos.length > 0) {
        RET_VAL.attachments = RESULT.videos;
      }
    } else {
      const ACA_ERROR = {
        type: 'TRANSFORMATION_ERROR',
        message: `[${MODULE_ID}] Missing required attachments attribute!`,
      };
      throw ACA_ERROR;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { attributes });
    logger.error(`${transform.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transform,
};
