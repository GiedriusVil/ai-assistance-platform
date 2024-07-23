/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-character-cleanup';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require(`@ibm-aca/aca-wrapper-lodash`);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const characterCleanup = (
  unformattedText: any,
): string => {
  try {
    let retVal: string;
    if (
      lodash.isEmpty(unformattedText) ||
      unformattedText == 'undefined'
    ) {
      retVal = '';
    } else {
      unformattedText = JSON.stringify(unformattedText);
      unformattedText = unformattedText.replace(/,/g, '');
      unformattedText = unformattedText.replace(/ ,/g, '');
      unformattedText = unformattedText.replace(/, /g, '');
      unformattedText = unformattedText.replace(/\n/g, ' *LineBreak* ');
      retVal = unformattedText;
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(characterCleanup.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
