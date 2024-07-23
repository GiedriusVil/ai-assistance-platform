/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-rules-rules-to-xls';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  RULES_XLS_SCHEMA,
} from './schema';

import {
  DEFAULT_BUSINESS_ACTION,
  addDefaultTextAlignmentOptions,
} from '../shared';

const TEMPLATE_LOC = `${__dirname}/rules-template.xlsx`;

const _insertRule = (
  sheet: any,
  rule: any,
) => sheet.addRow({
  id: rule.id,
  s_action: DEFAULT_BUSINESS_ACTION,
  name: rule.name,
  r_type: rule.type,
  messageId: rule.message.id,
  action: lodash.first(rule.actions),
  buyer: rule.buyer.id,
});

const _joinCondition = (
  row: any,
  condition: any,
) => {
  row.getCell('fact').value = condition.rootElement;
  row.getCell('path').value = condition.path;
  row.getCell('c_type').value = condition.type;
  row.getCell('value').value = condition.valAsString;
}

const _insertCondition = (
  sheet: any,
  condition: any,
) => {
  const ROW = sheet.addRow({
    fact: condition.rootElement,
    path: condition.path,
    c_type: condition.type,
    value: condition.valAsString
  });
  _addConditionValidations(ROW);
}

const _mergeUnusedRows = (
  sheet: any,
  row: any,
  amount: any,
) => {
  const RULE_BEGIN_ROW_INDEX = row.number;
  const RULE_END_ROW_INEDX = RULE_BEGIN_ROW_INDEX + amount;

  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 1, RULE_END_ROW_INEDX, 1);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 2, RULE_END_ROW_INEDX, 2);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 3, RULE_END_ROW_INEDX, 3);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 4, RULE_END_ROW_INEDX, 4);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 5, RULE_END_ROW_INEDX, 5);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 6, RULE_END_ROW_INEDX, 6);
  sheet.mergeCells(RULE_BEGIN_ROW_INDEX, 7, RULE_END_ROW_INEDX, 7);
}

const _addRuleValidations = (
  row: any,
) => {
  const S_ACTION_CELL = row.getCell('s_action');
  S_ACTION_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$A:$A'],
  };

  const TYPE_CELL = row.getCell('r_type');
  TYPE_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$B:$B'],
  };

  const R_ACTION_CELL = row.getCell('action');
  R_ACTION_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$C:$C'],
  };
}

const _addConditionValidations = (
  row: any,
) => {

  const FACT_CELL = row.getCell('fact');
  FACT_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$D:$D'],
  };

  const PATH_CELL = row.getCell('path');
  PATH_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$E:$E'],
  }

  const OPERATOR_CELL = row.getCell('c_type');
  OPERATOR_CELL.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['SYSTEM_LEGEND!$F:$F'],
  }
}

const _spreadValidation = (
  sheet: any,
) => {
  let i = 0;
  for (i; i < 1000; i++) {
    const row = sheet.addRow({});
    _addRuleValidations(row);
    _addConditionValidations(row);
  }
}

const _hideLegend = async (
  workbook: any,
) => {
  const LEGEND_SHEET = await workbook.getWorksheet('SYSTEM_LEGEND');
  LEGEND_SHEET.state = 'veryHidden';
}

export const rulesToXls = async (
  rules: any
) => {
  try {
    const WORKBOOK = new excelJS.Workbook();
    await WORKBOOK.xlsx.readFile(TEMPLATE_LOC);
    const SHEET = WORKBOOK.getWorksheet('RULES');
    SHEET.columns = RULES_XLS_SCHEMA;

    for (const rule of rules) {
      const row = _insertRule(SHEET, rule);
      _addRuleValidations(row);
      const CONDITIONS = ramda.pathOr([], ['conditions'], rule);
      for (const i in CONDITIONS) {
        const condition = CONDITIONS[i];

        const INDEX = parseInt(i);
        if (
          INDEX == 0
        ) {
          _joinCondition(row, condition);
        } else {
          _insertCondition(SHEET, condition);
        }
        _addConditionValidations(row);
      }
      _mergeUnusedRows(SHEET, row, CONDITIONS.length - 1);
    }
    addDefaultTextAlignmentOptions(SHEET);
    _spreadValidation(SHEET);
    await _hideLegend(WORKBOOK);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(rulesToXls.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
