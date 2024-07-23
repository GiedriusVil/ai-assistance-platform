/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-rules-xls-to-rules';
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
  RULES_XLS_SCHEMA,
} from './schema';

const XLS_SCHEMA = lodash.keyBy(RULES_XLS_SCHEMA, 'key');

const _hasRule = (row) => _hasSystemAction(row) && !_hasMerges(row);

const _hasSystemAction = (row) => !!_getCellValue(row, 's_action');

const _hasMerges = (
  row: any,
) => {
  const cells = ramda.pathOr([], ['model', 'cells'], row);
  return lodash.some(cells, _hasMaster);
}

const _hasMaster = (cell) => lodash.has(cell, 'master');

const _getCellValue = (
  row: any,
  schemaKey: any,
) => {
  const col = ramda.path([schemaKey, 'col'], XLS_SCHEMA);
  const cell = row.getCell(col);
  return ramda.path(['value'], cell);
}

const _ruleFromRow = (
  row: any,
) => {
  const rule = {
    rule: {
      id: _getCellValue(row, 'id'),
      name: _getCellValue(row, 'name'),
      buyer: {
        id: _getCellValue(row, 'buyer'),
      },
      type: _getCellValue(row, 'r_type'),
      code: _getCellValue(row, 'messageId'),
      actions: [_getCellValue(row, 'action')],
      filters: [],
      conditions: [_conditionFromRow(row)],
    },
    action: _getCellValue(row, 's_action'),
  };
  return rule;
}

const _conditionFromRow = (
  row: any,
) => {
  return {
    rootElement: _getCellValue(row, 'fact'),
    path: _getCellValue(row, 'path'),
    type: _getCellValue(row, 'c_type'),
    valAsString: _getCellValue(row, 'value'),
  };
}

export const xlsToRules = async (
  context: any,
  file: any,
) => {
  try {
    const RET_VAL = [];
    const filepath = ramda.path(['path'], file);
    const XLS_CONTENT = await readWorkSheet(filepath, 'RULES');
    XLS_CONTENT.eachRow((row, nowNumber) => {
      if (nowNumber == 1) {
        return;
      }
      if (_hasRule(row)) {
        const rule = _ruleFromRow(row);
        RET_VAL.push(rule);
      } else {
        const condition = _conditionFromRow(row);
        lodash.last(RET_VAL).rule.conditions.push(condition);
      }
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(xlsToRules.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
