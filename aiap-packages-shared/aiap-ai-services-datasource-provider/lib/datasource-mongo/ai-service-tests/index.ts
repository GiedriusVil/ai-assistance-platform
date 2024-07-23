/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceTestV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiServicesDatasourceMongoV1,
} from '..';

import {
  IFindAiServiceTestClassificationReportsByQueryParamsV1,
  IFindAiServiceTestClassificationReportsByQueryResponseV1,
  IFindAiServiceIncorrectIntentsByQueryParamsV1,
  IFindAiServiceIncorrectIntentsByQueryResponseV1,
  IFindAiServiceTestsByQueryParamsV1,
  IFindAiServiceTestsByQueryResponseV1,
  IFindAiServiceTestsLiteByQueryParamsV1,
  IFindAiServiceTestsByLiteQueryResponseV1,
  IFindAiServiceTestsResultsByQueryParamsV1,
  IFindAiServiceTestsResultsByQueryResponseV1,
  IFindAiServiceTestByIdParamsV1,
  IDeleteAiServiceTestByIdParamsV1,
  IDeleteAiServiceTestByIdResponseV1,
  ISaveAiServiceTestParamsV1,
} from '../../types/params/ai-service-tests';

import { findClassificationReportsByQuery } from './find-classification-reports-by-query';
import { findIncorrectIntentsByQuery } from './find-incorrect-intents-by-query';
import { findManyByQuery } from './find-many-by-query';
import { findManyLiteByQuery } from './find-many-lite-by-query';
import { findTestResultsByQuery } from './find-test-results-by-query';
import { deleteOneById } from './delete-one-by-id';
import { findOneById } from './find-one-by-id';
import { saveOne } from './save-one';

export const _aiServiceTests = (
  datasource: AiServicesDatasourceMongoV1,
) => {
  const RET_VAL = {
    findClassificationReportsByQuery: async (
      context: IContextV1,
      params: IFindAiServiceTestClassificationReportsByQueryParamsV1,
    ): Promise<IFindAiServiceTestClassificationReportsByQueryResponseV1> => {
      const TMP_RET_VAL = await findClassificationReportsByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findIncorrectIntentsByQuery: async (
      context: IContextV1,
      params: IFindAiServiceIncorrectIntentsByQueryParamsV1,
    ): Promise<IFindAiServiceIncorrectIntentsByQueryResponseV1> => {
      const TMP_RET_VAL = await findIncorrectIntentsByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyByQuery: async (
      context: IContextV1,
      params: IFindAiServiceTestsByQueryParamsV1,
    ): Promise<IFindAiServiceTestsByQueryResponseV1> => {
      const TMP_RET_VAL = await findManyByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findManyLiteByQuery: async (
      context: IContextV1,
      params: IFindAiServiceTestsLiteByQueryParamsV1,
    ): Promise<IFindAiServiceTestsByLiteQueryResponseV1> => {
      const TMP_RET_VAL = await findManyLiteByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    findTestResultsByQuery: async (
      context: IContextV1,
      params: IFindAiServiceTestsResultsByQueryParamsV1,
    ): Promise<IFindAiServiceTestsResultsByQueryResponseV1> => {
      const TMP_RET_VAL = await findTestResultsByQuery(datasource, context, params);
      return TMP_RET_VAL;
    },
    deleteOneById: async (
      context: IContextV1,
      params: IDeleteAiServiceTestByIdParamsV1,
    ): Promise<IDeleteAiServiceTestByIdResponseV1> => {
      const TMP_RET_VAL = await deleteOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    findOneById: async (
      context: IContextV1,
      params: IFindAiServiceTestByIdParamsV1,
    ): Promise<IAiServiceTestV1> => {
      const TMP_RET_VAL = await findOneById(datasource, context, params);
      return TMP_RET_VAL;
    },
    saveOne: async (
      context: IContextV1,
      params: ISaveAiServiceTestParamsV1,
    ): Promise<IAiServiceTestV1> => {
      const TMP_RET_VAL = await saveOne(datasource, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
