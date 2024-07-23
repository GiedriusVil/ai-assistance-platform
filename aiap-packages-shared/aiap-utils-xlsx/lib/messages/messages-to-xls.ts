/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-rules-messages-to-xls';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DEFAULT_BUSINESS_ACTION,
  addDefaultTextAlignmentOptions,
} from '../shared';

import {
  MESSAGES_XLS_SCHEMA,
  TEMPLATES_XLS_SCHEMA,
} from './schema';

const _messageToRow = (
  message: any,
) => {
  const templates = ramda.pathOr([], ['templates'], message);
  const templatePairs = templates.map(t => [t.language, t.message]);
  const templatesObj = lodash.fromPairs(templatePairs);

  return {
    _id: message.id,
    b_action: DEFAULT_BUSINESS_ACTION,
    name: message.name,
    code: message.code,
    ...templatesObj,
  };
};

export const messagesToXls = async (
  messages: any,
) => {
  try {
    const workbook = new excelJS.Workbook();
    const sheet = workbook.addWorksheet('MESSAGES');
    sheet.columns = lodash.concat(MESSAGES_XLS_SCHEMA, TEMPLATES_XLS_SCHEMA);
    for (const message of messages) {
      const row = _messageToRow(message);
      sheet.addRow(row);
    }
    addDefaultTextAlignmentOptions(sheet);
    const RET_VAL = workbook.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(messagesToXls.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
