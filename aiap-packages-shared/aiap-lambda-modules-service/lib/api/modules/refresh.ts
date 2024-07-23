/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-refresh';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

const {
  lambdaModulesAuditorService
} = require('@ibm-aca/aca-auditor-service');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const refresh = async (
  context: IContextV1, 
  params: {
    module: any,
    id: any,
}) => {
  try {
    const MODULE = params?.module;
    const ID = MODULE?.id;
    const AUDITOR_PARAMS = {
      action: 'REFRESH',
      docId: ID,
      docType: 'MODULE',
      doc: MODULE,
      docChanges: {},
    };

    lambdaModulesAuditorService.saveOne(context, AUDITOR_PARAMS);
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.RESET_LAMBDA_MODULE, { id: ID });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(refresh.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  refresh,
}
