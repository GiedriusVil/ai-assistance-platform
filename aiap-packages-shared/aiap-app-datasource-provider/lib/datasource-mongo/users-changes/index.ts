/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  // types
  IUserV1Changes,
  // api
  IParamsV1FindUserV1ChangesByQuery,
  IResponseV1FindUserV1ChangesByQuery,
  IParamsV1FindUserV1ChangesById,
  IParamsV1SaveUserV1Changes,
} from '@ibm-aiap/aiap--types-domain-app';

import { saveOne } from './save-one';
import { findOneById } from './find-one-by-id';
import { findManyByQuery } from './find-many-by-query';

export const _usersChanges = (
  datasource: DatasourceAppV1Mongo,
) => {
  const RET_VAL = {
    findManyByQuery: async (
      context: IContextV1,
      params: IParamsV1FindUserV1ChangesByQuery,
    ): Promise<IResponseV1FindUserV1ChangesByQuery> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IParamsV1FindUserV1ChangesById,
    ): Promise<IUserV1Changes> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: IParamsV1SaveUserV1Changes,
    ): Promise<IUserV1Changes> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}


