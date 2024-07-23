/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1SaveTenant,
  ITenantV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AIAP_EVENT_TYPE,
  getEventStreamMain,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  calculateHashForOne,
} from '../../utils/tenant-hash-utils';

import * as tenantsChangesService from '../tenants-changes';
import * as runtimeDataService from '../runtime-data';

const _publishTenantSaveEvent = (
  tenant: ITenantV1,
) => {
  const MAIN_EVENT_STREAM = getEventStreamMain();
  if (
    lodash.isEmpty(MAIN_EVENT_STREAM)
  ) {
    const MESSAGE = 'Unable to retrieve main-aca-event-stream!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
  }
  const EVENT = {
    ...tenant
  }
  MAIN_EVENT_STREAM.publish(AIAP_EVENT_TYPE.SAVE_TENANT, EVENT);
}

export const saveOne = async (
  context: IContextV1,
  params: IParamsV1SaveTenant,
) => {
  const PARAMS_TENANT = params?.value;
  try {
    const DATASOURCE = getDatasourceV1App();
    appendAuditInfo(context, PARAMS_TENANT);
    calculateHashForOne(PARAMS_TENANT);

    // TODO - fix this workaround!!
    if (
      !lodash.isEmpty(params?.value?.objectStorage) &&
      lodash.isEmpty(params?.value?.objectStorage?.id)
    ) {
      params.value.objectStorage.id = uuidv4();
    }

    const RET_VAL = await DATASOURCE.tenants.saveOne(context, params);
    _publishTenantSaveEvent(RET_VAL);

    if (
      RET_VAL
    ) {
      const CHANGE = {
        action: CHANGE_ACTION.SAVE_ONE,
        docId: PARAMS_TENANT.id,
        docType: 'TENANT',
        docName: PARAMS_TENANT?.id,
        doc: null,
        docChanges: null,
        timestamp: new Date(),
      }
      await tenantsChangesService.saveOne(context, { value: CHANGE });
    }

    await runtimeDataService.synchronizeWithConfigDirectoryTenant(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
