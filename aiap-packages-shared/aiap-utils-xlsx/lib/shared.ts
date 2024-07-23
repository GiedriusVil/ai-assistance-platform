/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-shared';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

const readWorkSheet = async (
  path: any,
  name: any,
) => {
  const workbook = new excelJS.Workbook();
  await workbook.xlsx.readFile(path);
  return workbook.getWorksheet(name);
}

const DEFAULT_CELL_ALIGNMENT_OPTIONS = {
  vertical: 'top',
  horizontal: 'left'
};

const addDefaultTextAlignmentOptions = (
  sheet: any,
) => {
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = DEFAULT_CELL_ALIGNMENT_OPTIONS;
    });
  });
};

const DEFAULT_BUSINESS_ACTION = 'UPDATE';

export {
  DEFAULT_BUSINESS_ACTION,
  addDefaultTextAlignmentOptions,
  readWorkSheet,
}
