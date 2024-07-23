/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-service-files-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError, throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  IContextV1,
  CHANGE_ACTION,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileSaveOneParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  getObjectStorageClientByTenant,
} from '@ibm-aiap/aiap-object-storage-client-provider';

import {
  getDatasourceByContext,
} from '../datasource-utils';

import * as bucketsService from '../buckets';
import * as filesChangesService from '../files-changes';

import {
  findOneById,
} from './find-one-by-id';

const _ensureFileExternalExistance = async (
  context: IContextV1,
  params: IFileSaveOneParamsV1,
) => {
  try {
    if (
      !lodash.isEmpty(params?.value?.file?.path) &&
      !lodash.isEmpty(params?.value?.file?.mimetype)
    ) {
      const DATASOURCE = getDatasourceByContext(context);
      const BUCKET = await DATASOURCE.buckets.findOneById(
        context,
        {
          id: params?.value?.bucketId,
        },
      );
      if (
        lodash.isEmpty(BUCKET)
      ) {
        const ERROR_MESSAGE = `Unable to retrieve bucket!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      const OBJECT_STORAGE_CLIENT = getObjectStorageClientByTenant(context?.user?.session?.tenant);
      const OBJECT_PARAMS = {
        bucketName: BUCKET?.external?.name,
        name: params?.value?.reference,
        filePath: params?.value?.file?.path,
        metaData: {
          'Content-Type': params?.value?.file?.mimetype,
        },
      };
      await OBJECT_STORAGE_CLIENT.saveFile(
        context,
        OBJECT_PARAMS,
      );
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_ensureFileExternalExistance.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _saveFileChanges = async (
  context: IContextV1,
  params: IFileSaveOneParamsV1,
) => {
  try {
    const CHANGES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });
    await filesChangesService.saveOne(
      context,
      {
        value: {
          action: CHANGE_ACTION.SAVE_ONE,
          docId: params?.value?.id,
          docType: 'FILE',
          docName: params?.value?.reference,
          docChanges: CHANGES,
          doc: params?.value,
          timestamp: new Date(),
        }
      }
    );
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_saveFileChanges.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (
  context: IContextV1,
  params: IFileSaveOneParamsV1,
) => {
  try {
    appendAuditInfo(context, params?.value);
    await _ensureFileExternalExistance(context, params);
    await _saveFileChanges(context, params);
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.files.saveOne(context, params);

    await bucketsService.refreshOneById(context, { id: params?.value?.bucketId });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  saveOne,
}
