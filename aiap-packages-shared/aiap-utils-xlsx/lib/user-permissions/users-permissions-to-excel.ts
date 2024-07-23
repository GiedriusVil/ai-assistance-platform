/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'utils-xlsx-users-permissions-users-permissions-to-excel';

const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import * as ExcelJS from 'exceljs';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  accessGroupsToWorksheet,
} from './access-groups-to-worksheet';

import {
  usersAccessGroupsToWorksheet,
} from './users-access-groups-to-worksheet';

import {
  usersTenantsToWorksheet,
} from './users-tenants-to-worksheet';

const usersPermissionsToExcel = async (
  users: any,
  accessGroups: any,
  tenants: any
) => {
  try {
    const WORKBOOK = new ExcelJS.Workbook();

    await usersAccessGroupsToWorksheet(WORKBOOK, users, accessGroups);
    await usersTenantsToWorksheet(WORKBOOK, users, tenants);
    await accessGroupsToWorksheet(WORKBOOK, accessGroups);

    const RET_VAL = WORKBOOK.xlsx.writeBuffer();

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(usersPermissionsToExcel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  usersPermissionsToExcel,
};
