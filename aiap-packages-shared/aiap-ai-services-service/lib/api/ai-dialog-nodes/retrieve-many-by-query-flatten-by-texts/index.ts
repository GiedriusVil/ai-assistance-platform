/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-dialog-nodes-retrieve-many-by-query-flatten-by-texts';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById,
} from '../../ai-skills';

import {
  retrieveManyByQuery,
} from '../retrieve-many-by-query';

import {
  flattenByTexts,
} from './flatten-by-texts';

export const retrieveManyByQueryFlattenByTexts = async (
  context: IContextV1,
  params: {
    query: {
      filter: {
        aiServiceId: any,
        aiSkillId: any,
      }
    }
  }
) => {
  let aiSkill: IAiSkillV1;
  try {
    aiSkill = await findOneById(context, { id: params?.query?.filter?.aiSkillId });

    const PARAMS = {
      query: {
        filter: {
          aiServiceId: params?.query?.filter?.aiServiceId,
          aiSkill: aiSkill,
        },
        pagination: {
          page: 1,
          size: 9999,
        },
      }
    };

    const RESPONSE = await retrieveManyByQuery(context, PARAMS);
    const ITEMS = flattenByTexts(RESPONSE?.items);
    const RET_VAL = {
      items: ITEMS,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQueryFlattenByTexts.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
