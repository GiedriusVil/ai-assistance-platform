/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as ExcelJS from 'exceljs';

import {
  addDefaultTextAlignmentOptions,
} from '../shared';

const setColumnWidth = (column: ExcelJS.Column) => {
  let maxWidth = 0;
  column.eachCell(cell => {
    maxWidth = Math.max(cell.value.toString().length, maxWidth);
  });

  column.width = maxWidth + 5;
};

const formatWorksheet = (worksheet: ExcelJS.Worksheet) => {
  worksheet.getRow(1).eachCell((cell: ExcelJS.Cell) => {
    cell.style = {
      font: {
        bold: true,
      },
    }
  });

  worksheet.eachColumnKey((col: ExcelJS.Column) => {
    setColumnWidth(col);
  });

  worksheet.autoFilter = worksheet.dimensions.range;

  addDefaultTextAlignmentOptions(worksheet)
}

export {
  setColumnWidth,
  formatWorksheet,
};
