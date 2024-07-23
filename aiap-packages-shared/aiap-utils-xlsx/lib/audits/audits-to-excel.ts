/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-json-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const excelJS = require('exceljs');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { AUDITS_XLS_SCHEMA } = require('./schema');
const { addDefaultTextAlignmentOptions } = require('../shared');

const _sanitizedRows = (rows) => {
  const RET_VAL = [];
  if (lodash.isArray(rows) && !lodash.isEmpty(rows)) {
    rows.forEach(row => {
      const SANITIZED_ROW = lodash.cloneDeep(row);
      const DOC_CHANGES = SANITIZED_ROW?.docChanges;
      const USER_ID = SANITIZED_ROW?.context?.user?.id;
      if (!lodash.isEmpty(DOC_CHANGES)) {
        SANITIZED_ROW.docChanges = getItemChanges(row);
      }
      if (!lodash.isEmpty(USER_ID)) {
        SANITIZED_ROW.userId = USER_ID
      }
      RET_VAL.push(SANITIZED_ROW);
    });
  }
  return RET_VAL;
};

const _insertAudit = (sheet, audit) => sheet.addRow({
  id: audit.id,
  action: audit.action,
  actionWithDoc: audit.actionWithDoc,
  docId: audit.docId,
  timestamp: audit.timestamp,
  docType: audit.docType,
  userId: audit.userId,
  docChanges: lodash.first(audit.docChanges),
});

const _addRowsToSheet = (
  rows: any,
  sheet: any,
) => {
  for (const AUDIT of rows) {
    const ROW = _insertAudit(sheet, AUDIT);
    const DOC_CHANGES: Array<number> = AUDIT?.docChanges || [];

    for (const i in DOC_CHANGES) {
      const DOC_CHANGE = DOC_CHANGES[i];
      const INDEX = parseInt(i);
      if (
        INDEX == 0
      ) {
        _joinDocChanges(ROW, DOC_CHANGE);
      } else {
        _insertDocChange(sheet, DOC_CHANGE);
      }
    }
    if (
      DOC_CHANGES.length > 1
    ) {
      _mergeUnusedRows(sheet, ROW, DOC_CHANGES.length - 1);
    }
  }
}

const _insertDocChange = (
  sheet: any,
  condition: any,
) => {
  sheet.addRow({
    fieldName: condition.fieldName,
    oldValue: condition.oldValue,
    newValue: condition.newValue,
  });
}

const _joinDocChanges = (
  row: any,
  docChange: any,
) => {
  row.getCell('fieldName').value = docChange?.fieldName;
  row.getCell('oldValue').value = docChange?.oldValue;
  row.getCell('newValue').value = docChange?.newValue;
}

const _mergeUnusedRows = (
  sheet: any,
  row: any,
  amount: any,
) => {
  const AUDIT_BEGIN_ROW_INDEX = row.number;
  const AUDIT_END_ROW_INDEX = AUDIT_BEGIN_ROW_INDEX + amount;

  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 1, AUDIT_END_ROW_INDEX, 1);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 2, AUDIT_END_ROW_INDEX, 2);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 3, AUDIT_END_ROW_INDEX, 3);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 4, AUDIT_END_ROW_INDEX, 4);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 5, AUDIT_END_ROW_INDEX, 5);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 6, AUDIT_END_ROW_INDEX, 6);
  sheet.mergeCells(AUDIT_BEGIN_ROW_INDEX, 7, AUDIT_END_ROW_INDEX, 7);
}

const getItemChanges = (
  item: any,
) => {
  const RET_VAL = [];
  const DOC_CHANGES = item?.docChanges;
  if (!lodash.isEmpty(DOC_CHANGES) && lodash.isArray(DOC_CHANGES)) {
    DOC_CHANGES.forEach(docChange => {
      const CHANGED_FIELD_KEY = (docChange?.path || [])[0];
      if (
        CHANGED_FIELD_KEY === 'title' ||
        CHANGED_FIELD_KEY === 'description' ||
        CHANGED_FIELD_KEY === 'status' ||
        CHANGED_FIELD_KEY === 'dueDate' ||
        CHANGED_FIELD_KEY === 'contentAnalyst' ||
        CHANGED_FIELD_KEY === 'backupAnalyst' ||
        CHANGED_FIELD_KEY === 'sourcingOwner'
      ) {

        let oldValue;
        let newValue;
        if (CHANGED_FIELD_KEY === 'sourcingOwner' && lodash.isEmpty(docChange?.lhs)) {
          oldValue = '',
            newValue = docChange?.rhs?.id;
        } else {
          oldValue = docChange?.lhs;
          newValue = docChange?.rhs;
        }

        RET_VAL.push({
          fieldName: convertCamelCaseToSentenceCase(CHANGED_FIELD_KEY),
          oldValue: oldValue,
          newValue: newValue,
        });
      }
    });
  }
  return RET_VAL;
}

const convertCamelCaseToSentenceCase = (
  text: any,
) => {
  const RESULT = text.replace(/([A-Z])/g, ' $1');
  const RET_VAL = RESULT.charAt(0).toUpperCase() + RESULT.slice(1);
  return RET_VAL;
}

export const auditsToExcel = async (
  AUDITS: any,
  sheetName = 'AUDITS',
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    const SHEET = WORKBOOK.addWorksheet(sheetName);
    const SANITIZED_ROWS = _sanitizedRows(AUDITS);
    SHEET.columns = AUDITS_XLS_SCHEMA;

    _addRowsToSheet(SANITIZED_ROWS, SHEET);
    addDefaultTextAlignmentOptions(SHEET);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(auditsToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
