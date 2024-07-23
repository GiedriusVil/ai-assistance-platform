/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-action-items-xls-to-action-items';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  readWorkSheet,
} from '../shared';

import {
  ACTION_ITEMS_XLS_SCHEMA,
} from './schema';

const XLS_SCHEMA = lodash.keyBy(ACTION_ITEMS_XLS_SCHEMA, 'key');

const _getCellValue = (
  row: any,
  schemaKey: any,
  defaultValue?: any,
) => {
  const COL = ramda.path([schemaKey, 'col'], XLS_SCHEMA);
  const CELL = row.getCell(COL);
  const VALUE = CELL?.value;
  if (
    !lodash.isEmpty(VALUE)
  ) {
    return VALUE;
  } else if (!lodash.isEmpty(defaultValue)) {
    return defaultValue;
  } else {
    return VALUE;
  }
}

const _actionItemFromRow = (
  row: any,
) => {
  const ARCHIVE_DATE = _getCellValue(row, 'archiveDate');
  const DUE_DATE = _getCellValue(row, 'dueDate');
  const CREATE_DATE = _getCellValue(row, 'createDate');
  const RET_VAL = {
    id: _getCellValue(row, 'id'),
    code: _getCellValue(row, 'code'),
    title: _getCellValue(row, 'title'),
    description: _getCellValue(row, 'description', ''),
    status: _getCellValue(row, 'status'),
    seller: {
      CompanyName: _getCellValue(row, 'seller'),
      CompanyAccountId: _getCellValue(row, 'sellerId'),
      Country: _getCellValue(row, 'sellerCountry'),
    },
    contentAnalyst: {
      id: _getCellValue(row, 'contentAnalyst', ''),
    },
    backupAnalyst: {
      id: _getCellValue(row, 'backupAnalyst', ''),
    },
    sourcingOwner: {
      id: _getCellValue(row, 'sourcingOwner', ''),
    },
    createdBy: _getCellValue(row, 'createdBy'),
    createDate: CREATE_DATE ? new Date(CREATE_DATE) : new Date(),
    publishDate: new Date(_getCellValue(row, 'publishDate')),
    dueDate: DUE_DATE ? new Date(DUE_DATE) : '',
    archiveDate: ARCHIVE_DATE ? new Date(ARCHIVE_DATE) : '',
    action: _getCellValue(row, 's_action'),
  };
  return RET_VAL;
}

export const xlsToActionItems = async (
  context: any,
  file: any,
) => {
  try {
    const RET_VAL = [];
    const filepath = ramda.path(['path'], file);
    const XLS_CONTENT = await readWorkSheet(filepath, 'ACTION_ITEMS');
    XLS_CONTENT.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        return;
      }
      const ACTION_ITEM = _actionItemFromRow(row);
      RET_VAL.push(ACTION_ITEM);
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(xlsToActionItems.name, { ACA_ERROR });
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, 'Failed to transform excel rows into action items!');
  }
}
