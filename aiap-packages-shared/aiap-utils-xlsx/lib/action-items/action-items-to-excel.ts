/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-json-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ACTION_ITEMS_XLS_SCHEMA,
} from './schema';

import {
  addDefaultTextAlignmentOptions,
} from '../shared';

const _sanitizeRows = (
  rows: Array<any>,
) => {
  const RET_VAL = [];
  if (
    lodash.isArray(rows) &&
    !lodash.isEmpty(rows)
  ) {
    rows.forEach(row => {
      const SANITIZED_ROW = lodash.cloneDeep(row);
      SANITIZED_ROW.seller = row?.seller?.CompanyName;
      SANITIZED_ROW.sellerId = row?.seller?.CompanyAccountId;
      SANITIZED_ROW.sellerCountry = row?.seller?.Country;
      SANITIZED_ROW.contentAnalyst = row?.contentAnalyst?.id;
      SANITIZED_ROW.backupAnalyst = row?.backupAnalyst?.id;
      SANITIZED_ROW.sourcingOwner = row?.sourcingOwner?.id;
      RET_VAL.push(SANITIZED_ROW);
    });
  }
  return RET_VAL;
};

const _addActionsColumn = (
  sheet: any,
) => {
  if (
    !lodash.isEmpty(sheet)
  ) {
    const LAST_COLUMN_INDEX = sheet.columnCount;
    for (let i = 2; i <= sheet.rowCount; i++) {
      sheet.getRow(i).getCell(LAST_COLUMN_INDEX).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"CREATE, UPDATE"']
      };
    }
  }
}

export const actionItemsToExcel = async (
  rows: any,
  sheetName = 'ACTION_ITEMS',
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    const SHEET = WORKBOOK.addWorksheet(sheetName);
    const SANITIZED_ROWS = _sanitizeRows(rows);
    SHEET.columns = ACTION_ITEMS_XLS_SCHEMA;
    SHEET.addRows(SANITIZED_ROWS);
    _addActionsColumn(SHEET);
    addDefaultTextAlignmentOptions(SHEET);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(actionItemsToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
