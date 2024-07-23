/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-mongo-ai-skil-releases-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IContextV1,
  IAiSkillReleaseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISaveAiSkillReleaseParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';

export const saveOne = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: ISaveAiSkillReleaseParamsV1,
): Promise<IAiSkillReleaseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkillReleases;

  let value: IAiSkillReleaseV1;
  let valueId: any;

  let filter;
  let update;
  try {
    value = params?.value;
    valueId = value?.id ? value?.id : uuidv4();

    const UPDATE_OPTIONS = {
      upsert: true
    }

    update = {
      $set: value
    };

    filter = {
      _id: valueId,
    }

    const MONGO_CLIENT = await datasource._getMongoClient();
    await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: update,
          options: UPDATE_OPTIONS
        });

    const RET_VAL = value;
    RET_VAL.id = valueId;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
