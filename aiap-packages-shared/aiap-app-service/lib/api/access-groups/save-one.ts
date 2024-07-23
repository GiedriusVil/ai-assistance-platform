/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAccessGroupV1,
  IParamsV1SaveAccessGroup,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';


import * as accessGroupsChangesService from '../access-groups-changes';
import * as runtimeDataService from '../runtime-data';

export const saveOne = async (
  context: IContextV1,
  params: IParamsV1SaveAccessGroup,
): Promise<IAccessGroupV1> => {
  let value: IAccessGroupV1;
  try {
    value = params?.value;
    const DATASOURCE = getDatasourceV1App();
    appendAuditInfo(context, value);
    const EXISTING = await DATASOURCE.accessGroups.findOneByName(context, { name: value?.name });
    if (
      !lodash.isEmpty(EXISTING) &&
      value.id !== EXISTING.id
    ) {
      const ERROR_MESSAGE = 'Access group with the same name already exists!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL = await DATASOURCE.accessGroups.saveOne(context, params);
    if (
      RET_VAL
    ) {
      const CHANGE = {
        action: CHANGE_ACTION.SAVE_ONE,
        docId: value.id,
        docType: 'ACCESS_GROUP',
        docName: value?.id,
        doc: value,
        docChanges: null,
        timestamp: new Date(),
      }
      await accessGroupsChangesService.saveOne(context, { value: CHANGE });
    }
    await runtimeDataService.synchronizeWithConfigDirectoryAccessGroup(context, { value: RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
