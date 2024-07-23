/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-organizations-xls-to-organizations';
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
  ORGANIZATIONS_XLS_SCHEMA,
} from './schema';

const XLS_SCHEMA = lodash.keyBy(ORGANIZATIONS_XLS_SCHEMA, 'key');

const _organizationFromRow = (
  row: any,
) => {
  const ORGANIZATION = {
    action: _getCellValue(row, 's_action'),
    organization: {
      id: _getCellValue(row, 'id'),
      name: _getCellValue(row, 'name'),
      external: {
        id: _getCellValue(row, 'externalId'),
      },
      isAuthorized: _getCellValue(row, 'isAuthorized'),
      isBuyer: _getCellValue(row, 'isBuyer'),
      isSeller: _getCellValue(row, 'isSeller'),
    },
  };
  return ORGANIZATION;
}

const _getCellValue = (
  row: any,
  schemaKey: any,
) => {
  const col = ramda.path([schemaKey, 'col'], XLS_SCHEMA);
  const cell = row.getCell(col);
  return ramda.path(['value'], cell);
}

export const xlsToOrganizations = async (
  context: any,
  file: any,
) => {
  try {
    const RET_VAL = [];
    const filepath = file?.path;
    const XLS_CONTENT = await readWorkSheet(filepath, 'ORGANIZATIONS');
    XLS_CONTENT.eachRow(function (row, rowNumber) {
      if (rowNumber == 1) {
        return;
      }
      const ORGANIZATION = _organizationFromRow(row);
      RET_VAL.push(ORGANIZATION);
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(xlsToOrganizations.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
