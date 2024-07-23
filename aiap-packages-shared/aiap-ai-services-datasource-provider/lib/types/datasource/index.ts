/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiServiceChangesV1,
  IAiServiceChangeRequestV1,
  IAiServiceTestV1,
  IAiServiceV1,
  IAiSkillReleaseV1,
  IAiSkillV1,
} from '@ibm-aiap/aiap--types-server';

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
} from '../params/ai-service-tests';

import {
  IFindAiServicesByQueryParamsV1,
  IFindAiServicesByQueryResponseV1,
  IDeleteAiServicesByIdsParamsV1,
  IDeleteAiServicesByIdsResponseV1,
  IFindAiServiceByIdParamsV1,
  IFindAiServiceByNameParamsV1,
  ISaveAiServiceParamsV1,
} from '../params/ai-services';

import {
  IFindAiServiceChangesByQueryParamsV1,
  IFindAiServiceChangesByQueryResponseV1,
  IFindAiServiceChangeByIdParamsV1,
  ISaveAiServiceChangeParamsV1,
} from '../params/ai-services-changes';

import {
  IFindAiSkillReleasesByQueryParamsV1,
  IFindAiSkillReleasesByQueryResponseV1,
  IFindAiSkillReleasesLiteByQueryParamsV1,
  IFindAiSkillReleasesLiteByQueryResponseV1,
  IDeleteAiSkillReleasesByIdsParamsV1,
  IDeleteAiSkillReleasesByIdsResponseV1,
  IDeleteAiSkillReleaseByIdParamsV1,
  IDeleteAiSkillReleaseByIdResponseV1,
  IFindAiSkillReleaseByIdParamsV1,
  ISaveAiSkillReleaseParamsV1,
} from '../params/ai-skill-releases';

import {
  IFindAiSkillsByActionTagIdParamsV1,
  IFindAiSkillsByActionTagIdResponseV1,
  IFindAiSkillsByAnswerKeyParamsV1,
  IFindAiSkillsByAnswerKeyResponseV1,
  IFindAiSkillsByQueryParamsV1,
  IFindAiSkillsByQueryResponseV1,
  IFindAiSkillsLiteByQueryParamsV1,
  IFindAISkillsLiteByQueryResponseV1,
  IDeleteAiSkillsByIdsParamsV1,
  IDeleteAiSkillsByIdsResponseV1,
  IDeleteAiSkillByIdParamsV1,
  IDeleteAiSkillByIdResponseV1,
  IFindAiSkillByAiServiceIdAndNameParamsV1,
  IFindAiSkillByIdParamsV1,
  ISaveAiSkillParamsV1,
} from '../params/ai-skills';

import {
  IFindAiServicesChangeRequestByQueryParamsV1,
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1,
  IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1,
  IFindAiServicesChangeRequestByQueryResponseV1,
  IDeleteAiServicesChangeRequestByIdsParamsV1,
  IDeleteAiServicesChangeRequestByIdsResponseV1,
  IFindAiServiceChangeRequestByIdParamsV1,
  ISaveAiServiceChangeRequestParamsV1

} from '../params/ai-service-change-request';

export interface IDatasourceAiServicesV1 {

  get aiServicesChangeRequest(): {
    saveOne(
      context: IContextV1,
      params: ISaveAiServiceChangeRequestParamsV1,
    ): Promise<IAiServiceChangeRequestV1>,
    deleteManyByIds(
      context: IContextV1,
      params: IDeleteAiServicesChangeRequestByIdsParamsV1,
    ): Promise<IDeleteAiServicesChangeRequestByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFindAiServicesChangeRequestByQueryParamsV1,
    ): Promise<IFindAiServicesChangeRequestByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindAiServiceChangeRequestByIdParamsV1,
    ): Promise<IFindAiServiceChangeRequestByIdParamsV1>,
    findOneByAiServiceAndAiSkillId(
      context: IContextV1,
      params: IFindAiServiceChangeRequestByAiServiceAndAiSkillIdParamsV1,
    ): Promise<IFindAiServiceChangeRequestByAiServiceAndAiSkillIdResponseV1>,
  }

  get aiServiceTests(): {
    findClassificationReportsByQuery(
      context: IContextV1,
      params: IFindAiServiceTestClassificationReportsByQueryParamsV1,
    ): Promise<IFindAiServiceTestClassificationReportsByQueryResponseV1>,
    findIncorrectIntentsByQuery(
      context: IContextV1,
      params: IFindAiServiceIncorrectIntentsByQueryParamsV1,
    ): Promise<IFindAiServiceIncorrectIntentsByQueryResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFindAiServiceTestsByQueryParamsV1,
    ): Promise<IFindAiServiceTestsByQueryResponseV1>,
    findManyLiteByQuery(
      context: IContextV1,
      params: IFindAiServiceTestsLiteByQueryParamsV1,
    ): Promise<IFindAiServiceTestsByLiteQueryResponseV1>,
    findTestResultsByQuery(
      context: IContextV1,
      params: IFindAiServiceTestsResultsByQueryParamsV1,
    ): Promise<IFindAiServiceTestsResultsByQueryResponseV1>,
    deleteOneById(
      context: IContextV1,
      params: IDeleteAiServiceTestByIdParamsV1,
    ): Promise<IDeleteAiServiceTestByIdResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindAiServiceTestByIdParamsV1,
    ): Promise<IAiServiceTestV1>,
    saveOne(
      context: IContextV1,
      params: ISaveAiServiceTestParamsV1,
    ): Promise<IAiServiceTestV1>,
  }

  get aiServices(): {
    findManyByQuery(
      context: IContextV1,
      params: IFindAiServicesByQueryParamsV1,
    ): Promise<IFindAiServicesByQueryResponseV1>,

    deleteManyByIds(
      context: IContextV1,
      params: IDeleteAiServicesByIdsParamsV1,
    ): Promise<IDeleteAiServicesByIdsResponseV1>,

    findOneById(
      context: IContextV1,
      params: IFindAiServiceByIdParamsV1,
    ): Promise<IAiServiceV1>,
    findOneByName(
      context: IContextV1,
      params: IFindAiServiceByNameParamsV1,
    ): Promise<IAiServiceV1>,
    saveOne(
      context: IContextV1,
      params: ISaveAiServiceParamsV1,
    ): Promise<IAiServiceV1>,
  }

  get aiServicesChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IFindAiServiceChangesByQueryParamsV1,
    ): Promise<IFindAiServiceChangesByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindAiServiceChangeByIdParamsV1,
    ): Promise<IAiServiceChangesV1>,
    saveOne(
      context: IContextV1,
      params: ISaveAiServiceChangeParamsV1,
    ): Promise<IAiServiceChangesV1>,
  }

  get aiSkillReleases(): {
    findManyByQuery(
      context: IContextV1,
      params: IFindAiSkillReleasesByQueryParamsV1,
    ): Promise<IFindAiSkillReleasesByQueryResponseV1>,
    findManyLiteByQuery(
      context: IContextV1,
      params: IFindAiSkillReleasesLiteByQueryParamsV1,
    ): Promise<IFindAiSkillReleasesLiteByQueryResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      params: IDeleteAiSkillReleasesByIdsParamsV1,
    ): Promise<IDeleteAiSkillReleasesByIdsResponseV1>,
    deleteOneById(
      context: IContextV1,
      params: IDeleteAiSkillReleaseByIdParamsV1,
    ): Promise<IDeleteAiSkillReleaseByIdResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindAiSkillReleaseByIdParamsV1,
    ): Promise<IAiSkillReleaseV1>,
    saveOne(
      context: IContextV1,
      params: ISaveAiSkillReleaseParamsV1,
    ): Promise<IAiSkillReleaseV1>,
  }

  get aiSkills(): {
    findManyByActionTagId(
      context: IContextV1,
      params: IFindAiSkillsByActionTagIdParamsV1,
    ): Promise<IFindAiSkillsByActionTagIdResponseV1>,
    findManyByAnswerKey(
      context: IContextV1,
      params: IFindAiSkillsByAnswerKeyParamsV1,
    ): Promise<IFindAiSkillsByAnswerKeyResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFindAiSkillsByQueryParamsV1,
    ): Promise<IFindAiSkillsByQueryResponseV1>,
    findManyLiteByQuery(
      context: IContextV1,
      params: IFindAiSkillsLiteByQueryParamsV1,
    ): Promise<IFindAISkillsLiteByQueryResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      params: IDeleteAiSkillsByIdsParamsV1,
    ): Promise<IDeleteAiSkillsByIdsResponseV1>,
    deleteOneById(
      context: IContextV1,
      params: IDeleteAiSkillByIdParamsV1,
    ): Promise<IDeleteAiSkillByIdResponseV1>,
    findOneByAiServiceIdAndName(
      context: IContextV1,
      params: IFindAiSkillByAiServiceIdAndNameParamsV1,
    ): Promise<IAiSkillV1>,
    findOneById(
      context: IContextV1,
      params: IFindAiSkillByIdParamsV1,
    ): Promise<IAiSkillV1>,
    saveOne(
      context: IContextV1,
      params: ISaveAiSkillParamsV1,
    ): Promise<IAiSkillV1>,
  }
}


