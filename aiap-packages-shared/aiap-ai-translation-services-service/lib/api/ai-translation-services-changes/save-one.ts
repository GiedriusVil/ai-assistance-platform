/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-services-changes-service-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo
} from '@ibm-aiap/aiap-utils-audit';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationServicesChangesSaveOneParamsV1,
  IAiTranslationServicesChangesSaveOneResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const saveOne = async (
  context: IContextV1,
  params: IAiTranslationServicesChangesSaveOneParamsV1
): Promise<IAiTranslationServicesChangesSaveOneResponseV1> => {
  try {
    const AUDIT_RECORD = {
      action: params?.action,
      docType: 'AI TRANSLATION SERVICE',
      docId: params?.value?.id,
      docName: params?.value?.name || params?.value?.id,
      doc: params?.value,
      docChanges: params?.docChanges || [],
      context: context,
      timestamp: new Date(),
    }

    appendAuditInfo(context, AUDIT_RECORD);

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationServicesChanges.saveOne(context, { value: AUDIT_RECORD });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  saveOne,
};
