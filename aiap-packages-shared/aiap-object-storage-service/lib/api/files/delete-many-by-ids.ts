/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-files-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileDeleteManyByIdsParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  getDatasourceByContext,
} from '../datasource-utils';

import * as bucketsService from '../buckets';

const _retrieveBucketIds = async (
  context: IContextV1,
  params: IFileDeleteManyByIdsParamsV1,
) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [];
    if (
      !lodash.isEmpty(params?.ids) &&
      lodash.isArray(params?.ids)
    ) {
      for (const ID of params.ids) {
        PROMISES.push(DATASOURCE.files.findOneById(context, { id: ID }));
      }
    }
    const PROMISE_RESULTS = await Promise.all(PROMISES);
    const RET_VAL_AS_SET = new Set<string>();
    for (const PROMISE_RESULT of PROMISE_RESULTS) {
      if (
        PROMISE_RESULT?.bucketId
      ) {
        RET_VAL_AS_SET.add(PROMISE_RESULT?.bucketId);
      }
    }
    const RET_VAL = Array.from(RET_VAL_AS_SET.values());
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByIds = async (
  context: IContextV1,
  params: IFileDeleteManyByIdsParamsV1,
) => {
  try {
    const BUCKET_IDS = await _retrieveBucketIds(context, params);
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.files.deleteManyByIds(context, params);

    await bucketsService.refreshManyByIds(context, { ids: BUCKET_IDS });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByIds,
}
