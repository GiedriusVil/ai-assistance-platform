/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-users-permissions-user-tenants-to-worksheet';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import * as ExcelJS from 'exceljs';

import * as ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  USER_TENANTS_SCHEMA,
} from './schema';

import {
  formatWorksheet,
} from './utils';

const usersTenantsToWorksheet = async (
  workbook: ExcelJS.Workbook,
  users: any,
  tenants: any,
  sheetName = 'Tenants',
) => {
  try {
    const WORKSHEET = workbook.addWorksheet(sheetName);

    WORKSHEET.columns = USER_TENANTS_SCHEMA;

    const TENANTS_BY_ID = tenants.reduce((acc: any, tenant: any) => {
      acc[tenant.id] = tenant;
      return acc;
    }, {});

    const USERS = users.flatMap((user: any) => {
      const DATA = {
        username: user.username,
        tenant: user?.tenants?.map((tenant: any) => TENANTS_BY_ID[tenant.id].name).filter((name: string) => name) || [],
      };

      return ramda.unwind('tenant', DATA);
    });

    WORKSHEET.addRows(USERS);

    formatWorksheet(WORKSHEET);

    return WORKSHEET;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(usersTenantsToWorksheet.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  usersTenantsToWorksheet
}
