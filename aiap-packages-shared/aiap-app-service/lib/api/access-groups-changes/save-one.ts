/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1SaveAccessGroupV1Changes,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const saveOne = async (
  context: IContextV1,
  params: IParamsV1SaveAccessGroupV1Changes,
) => {
  try {
    appendAuditInfo(context, params?.value);
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.accessGroupsChanges.saveOne(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
