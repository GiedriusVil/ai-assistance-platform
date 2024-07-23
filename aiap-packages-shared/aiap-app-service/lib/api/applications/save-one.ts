
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-applications-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1,
  IApplicationV1Changes,
  IParamsV1SaveApplication,
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

import * as applicationsChangesService from '../applications-changes';
import * as runtimeDataService from '../runtime-data';

export const saveOne = async (
  context: IContextV1,
  params: IParamsV1SaveApplication,
): Promise<IApplicationV1> => {
  let value: IApplicationV1;
  try {
    value = params?.value;
    const DATASOURCE = getDatasourceV1App();
    appendAuditInfo(context, value);
    const RET_VAL = await DATASOURCE.applications.saveOne(context, params);
    if (
      RET_VAL
    ) {
      const CHANGES: IApplicationV1Changes = {
        action: CHANGE_ACTION.SAVE_ONE,
        docId: value?.id,
        docType: 'APPLICATION',
        docName: value?.id,
        doc: null,
        docChanges: null,
        timestamp: new Date(),
      }
      await applicationsChangesService.saveOne(context, { value: CHANGES });
    }
    await runtimeDataService.synchronizeWithConfigDirectoryApplication(context, { value: RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

