/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-service-lib-api-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IContextV1,
  IEngagementV1,
  CHANGE_ACTION,
} from '@ibm-aiap/aiap--types-server';

import {
  ISaveEngagementParamsV1
} from '../../types';

import {
  findOneById,
} from './find-one-by-id';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  getEventStreamMain,
  getEventStreamByContext,
  AIAP_EVENT_TYPE,
} from '@ibm-aiap/aiap-event-stream-provider';

import {
  appendAuditInfo,
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getEngagementsDatasourceByContext
} from '../datasource.utils';

import * as runtimeDataService from '../runtime-data';
import * as engagementsChangesService from '../engagements-changes';

const _publishEngagementSaveEvent = (
  context: IContextV1,
  engagement: IEngagementV1
) => {
  const MAIN_EVENT_STREAM = getEventStreamMain();
  if (
    lodash.isEmpty(MAIN_EVENT_STREAM)
  ) {
    const MESSAGE = 'Unable to retrieve main-aca-event-stream!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
  }
  const EVENT = {
    ...engagement
  }
  getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.SAVE_ENGAGEMENT, EVENT);
}

export const saveOne = async (
  context: IContextV1,
  params: ISaveEngagementParamsV1
): Promise<IEngagementV1> => {
  try {
    appendAuditInfo(context, params?.value);

    // TODO MM 
    // Following logic some how needs to be within a single transaction
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const CHANGES_SERVICE_PARAMS = {
      ...params,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await engagementsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    const DATASOURCE = getEngagementsDatasourceByContext(context);

    const RET_VAL = await DATASOURCE.engagements.saveOne(context, params);

    _publishEngagementSaveEvent(context, RET_VAL);

    await runtimeDataService.synchronizeWithConfigDirectoryEngagement(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
