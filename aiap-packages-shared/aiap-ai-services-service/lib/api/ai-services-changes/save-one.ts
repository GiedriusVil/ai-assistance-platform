/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-ai-services-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
  CHANGE_ACTION,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';


export const saveOne = async (
  context: IContextV1,
  params: {
    action: CHANGE_ACTION,
    value: IAiServiceV1,
    docChanges: any,
  }
) => {
  try {
    const AUDIT_RECORD = {
      action: params?.action,
      docType: 'AI SERVICE',
      doc: params?.value,
      docChanges: params?.docChanges || [],
      docName: params?.value?.name || params?.value?.id,
      docId: params?.value?.id,
      context: context,
      timestamp: new Date()
    }
    appendAuditInfo(context, AUDIT_RECORD);
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiServicesChanges.saveOne(context, { value: AUDIT_RECORD });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
