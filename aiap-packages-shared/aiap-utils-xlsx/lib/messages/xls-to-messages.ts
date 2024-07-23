/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-rules-xls-to-messages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  readWorkSheet,
} from '../shared';

import {
  MESSAGES_XLS_SCHEMA,
  TEMPLATES_XLS_SCHEMA,
} from './schema';

const XLS_SCHEMA = lodash.keyBy(MESSAGES_XLS_SCHEMA, 'key');

const _messageFromRow = (row) => {
  const MESSAGE = {
    action: _getCellValue(row, 'b_action'),
    message: {
      id: _getCellValue(row, '_id'),
      name: _getCellValue(row, 'name'),
      code: _getCellValue(row, 'code'),
      templates: _templatesFromRow(row),
    },
  };
  return MESSAGE;
}

const _getCellValue = (row, schemaKey) => {
  const col = ramda.path([schemaKey, 'col'], XLS_SCHEMA);
  const cell = row.getCell(col);
  return ramda.path(['value'], cell);
}

const _templatesFromRow = (
  row: any,
) => {
  const templates = [];

  for (const templateColumn of TEMPLATES_XLS_SCHEMA) {

    if (_isTemplateConfigured(row, templateColumn.col)) {

      const template = {
        index: templates.length,
        message: row.getCell(templateColumn.col).value,
        language: templateColumn.key,
      }
      templates.push(template);
    }
  }
  return templates;
}

const _isTemplateConfigured = (row, col) => !!row.getCell(col).value;

export const xlsToMessages = async (
  context: any,
  file: any,
) => {
  try {
    const RET_VAL = [];
    const filepath = ramda.path(['path'], file);
    const xls = await readWorkSheet(filepath, 'MESSAGES');
    xls.eachRow((row, nowNumber) => {
      if (nowNumber == 1) {
        return;
      }
      const message = _messageFromRow(row);
      RET_VAL.push(message);
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(xlsToMessages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
