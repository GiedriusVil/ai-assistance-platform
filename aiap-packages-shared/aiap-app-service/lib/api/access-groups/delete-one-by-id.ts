/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-access-groups-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteAccessGroupById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import * as accessGroupsChangesService from '../access-groups-changes';

import * as runtimeDataService from '../runtime-data';

export const deleteOneById = async (
  context: IContextV1,
  params: IParamsV1DeleteAccessGroupById,
) => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.accessGroups.deleteOneById(context, params);
    if (
      RET_VAL
    ) {
      const CHANGE = {
        action: CHANGE_ACTION.DELETE_ONE_BY_ID,
        docId: params.id,
        docType: 'ACCESS_GROUP',
        docName: params?.id,
        doc: null,
        docChanges: null,
        timestamp: new Date(),
      }
      await accessGroupsChangesService.saveOne(context, { value: CHANGE });
    }
    await runtimeDataService.deleteManyByIdsFromConfigDirectoryAccessGroup(
      context,
      {
        ids: [params?.id]
      }
    );
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneById.name);
    throw ACA_ERROR;
  }
}
