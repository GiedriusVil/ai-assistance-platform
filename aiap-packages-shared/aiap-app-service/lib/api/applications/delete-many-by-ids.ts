/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-applications-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1Changes,
  IParamsV1DeleteApplicationsByIds,
  IResponseV1DeleteApplicationsByIds,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import * as runtimeDataService from '../runtime-data';
import * as applicationsChangesService from '../applications-changes';

const _saveApplicationV1Changes = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
  },
) => {
  try {
    const IDS = params?.ids;
    if (
      !lodash.isEmpty(IDS)
    ) {
      const PROMISES = [];
      IDS?.forEach(id => {
        const CHANGE: IApplicationV1Changes = {
          action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
          docId: id,
          docType: 'APPLICATION',
          docName: id,
          doc: null,
          docChanges: null,
          timestamp: new Date(),
        }
        PROMISES.push(applicationsChangesService.saveOne(context, { value: CHANGE }));
      });
      Promise.all(PROMISES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_saveApplicationV1Changes.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const deleteManyByIds = async (
  context: IContextV1,
  params: IParamsV1DeleteApplicationsByIds,
): Promise<IResponseV1DeleteApplicationsByIds> => {
  let retVal;
  try {
    const DATASOURCE = getDatasourceV1App();
    retVal = await DATASOURCE.applications.deleteManyByIds(context, params);
    if (
      retVal
    ) {
      await _saveApplicationV1Changes(context, params);
    }

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryApplication(context, { ids: params?.ids })
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
