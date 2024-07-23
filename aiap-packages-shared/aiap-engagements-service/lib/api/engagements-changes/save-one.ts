/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-engagements-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

import {
  IContextV1,
  IEngagementChangeV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveEngagementChangeParamsV1
} from '../../types';

export const saveOne = async (
  context: IContextV1,
  params: ISaveEngagementChangeParamsV1
): Promise<IEngagementChangeV1> => {
  try {
    const AUDIT_RECORD = {
      action: params?.action,
      docType: 'ENGAGEMENT',
      docId: params?.value?.id,
      docName: params?.value?.name || params?.value?.id,
      doc: params?.value,
      docChanges: params?.docChanges || [],
      context: context,
      timestamp: new Date(),
    }

    appendAuditInfo(context, AUDIT_RECORD);

    const DATASOURCE = getEngagementsDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.engagementsChanges.saveOne(context, { value: AUDIT_RECORD });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
