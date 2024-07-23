/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { IContextV1 } from '@ibm-aiap/aiap--types-server';

import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

import { 
  LambdaModulesDatasourceMongoV1 
} from '../';

export const _modulesReleases = (datasource: LambdaModulesDatasourceMongoV1) => {
  const RET_VAL = {
    saveOne: async (context: IContextV1, params: any) => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (context: IContextV1, params: any) => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
};
