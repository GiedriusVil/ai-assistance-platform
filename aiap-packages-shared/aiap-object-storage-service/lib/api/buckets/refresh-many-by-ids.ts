/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-buckets-refresh-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  refreshOneById,
} from './refresh-one-by-id';

const refreshManyByIds = async (
  context: IContextV1,
  params: {
    ids: Array<string>,
  }
) => {
  try {
    const PROMISES = [];
    for (const ID of params.ids) {
      PROMISES.push(refreshOneById(context, { id: ID }));
    }
    await Promise.all(PROMISES);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(refreshOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  refreshManyByIds,
}
