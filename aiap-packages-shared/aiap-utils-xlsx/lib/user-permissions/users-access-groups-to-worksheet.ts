/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-users-permissions-user-access-groups-to-worksheet';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import * as ExcelJS from 'exceljs';
import * as ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  USER_ACCESS_GROUPS_SCHEMA,
} from './schema';

import {
  formatWorksheet,
} from './utils';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const usersAccessGroupsToWorksheet = async (
  workbook: ExcelJS.Workbook,
  users: any,
  accessGroups: any,
  sheetName = 'Access Groups',
) => {
  try {
    const WORKSHEET = workbook.addWorksheet(sheetName);

    WORKSHEET.columns = USER_ACCESS_GROUPS_SCHEMA;

    const ACCESS_GROUP_BY_ID = accessGroups.reduce((acc: any, accessGroup: any) => {
      acc[accessGroup.id] = accessGroup;
      return acc;
    }, {});

    const USERS = users.flatMap((user: any) => {
      const DATA = {
        username: user.username,
        accessGroup: user.accessGroupIds.map((id: string) => ACCESS_GROUP_BY_ID[id]?.name).filter((ag: string) => ag),
      };

      return ramda.unwind('accessGroup', DATA);
    });

    WORKSHEET.addRows(USERS);

    formatWorksheet(WORKSHEET);

    return WORKSHEET;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(usersAccessGroupsToWorksheet.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


export {
  usersAccessGroupsToWorksheet
}
