/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-announcements-xls-to-announcements';
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
  ANNOUNCEMENT_XLS_SCHEMA,
} from './schema';

const XLS_SCHEMA = lodash.keyBy(ANNOUNCEMENT_XLS_SCHEMA, 'key');

const _announcementFromRow = (
  row: any,
) => {
  const ARCHIVE_DATE = _getCellValue(row, 'archiveDate');
  const CREATE_DATE = _getCellValue(row, 'createDate');
  const PUBLISH_DATE = _getCellValue(row, 'publishDate');

  const ANNOUNCEMENT = {
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
    createdBy: _getCellValue(row, 'createdBy'),
    createDate: CREATE_DATE ? new Date(CREATE_DATE) : new Date(),
    publishDate: PUBLISH_DATE ? new Date(PUBLISH_DATE) : '',
    archiveDate: ARCHIVE_DATE ? new Date(ARCHIVE_DATE) : '',
    action: _getCellValue(row, 's_action'),
  };
  return ANNOUNCEMENT;
}

const _getCellValue = (
  row: any,
  schemaKey: any,
  defaultValue?: any,
) => {
  const COL = ramda.path([schemaKey, 'col'], XLS_SCHEMA);
  const CELL = row.getCell(COL);
  const VALUE = ramda.path(['value'], CELL);
  if (!lodash.isEmpty(VALUE)) {
    return VALUE;
  } else if (!lodash.isEmpty(defaultValue)) {
    return defaultValue;
  } else {
    return VALUE;
  }
}

export const xlsToAnnouncements = async (
  context: any,
  file: any,
) => {
  try {
    const RET_VAL = [];
    const filepath = ramda.path(['path'], file);
    const XLS_CONTENT = await readWorkSheet(filepath, 'ANNOUNCEMENTS');
    XLS_CONTENT.eachRow(function (row, rowNumber) {
      if (rowNumber == 1) {
        return;
      }
      const ANNOUNCEMENT = _announcementFromRow(row);
      RET_VAL.push(ANNOUNCEMENT);
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(xlsToAnnouncements.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
