
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-services-datasource-mongo-ai-skills-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import {
  ReadPreference,
} from 'mongodb';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  sanitizeIdAttribute,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  IFindAiSkillByIdParamsV1,
} from '../../types';

import {
  AiServicesDatasourceMongoV1,
} from '..';


export const findOneById = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiSkillByIdParamsV1,
): Promise<IAiSkillV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiSkills;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  let id;

  let filter;
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    id = params?.id;

    if (
      !validator.isMongoId(id) &&
      !validator.isAlphanumeric(id, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Parameter params.id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: {
        $eq: id,
      }
    };

    const MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__findToArray(context,
        {
          collection: COLLECTION,
          collectionOptions: COLLECTION_OPTIONS,
          filter: filter
        });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
