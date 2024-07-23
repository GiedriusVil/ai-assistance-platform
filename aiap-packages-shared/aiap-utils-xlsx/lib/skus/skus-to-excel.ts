/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-skus-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  addDefaultTextAlignmentOptions,
} from '../shared';

const _createExcelColumn = (
  dataItem: any,
) => {
  const COLUMNS = [];
  if (
    !lodash.isEmpty(dataItem)
  ) {
    const KEYS = Object.keys(dataItem);
    for (const KEY of KEYS) {
      COLUMNS.push({
        header: KEY,
        key: KEY,
      });
    }
  }
  return COLUMNS;
};

export const skusToExcel = async (
  rows: any,
  sheetName = 'SKUs',
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    const SHEET = WORKBOOK.addWorksheet(sheetName);
    const DATA_ITEM = ramda.pathOr({ NO_DATA: 'NO_DATA' }, [0], rows);
    SHEET.columns = _createExcelColumn(DATA_ITEM);
    SHEET.addRows(rows);

    addDefaultTextAlignmentOptions(SHEET);
    return WORKBOOK.xlsx.writeBuffer();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(skusToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

