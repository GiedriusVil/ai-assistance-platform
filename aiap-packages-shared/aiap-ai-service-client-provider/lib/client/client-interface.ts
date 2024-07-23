/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  //ai-change-request
  IRetrieveSkillsResponseV1,
  IRetrieveSkillParamsV1,
  IFormatIntentsParamsV1,
  IFormatIntentsResponseV1,
  IImportSkillsParamsV1,
  IImportSkillsResponseV1,
  // ai-dialog-nodes
  IRetrieveAiDialogNodesByQueryParamsV1,
  IRetrieveAiDialogNodesByQueryResponseV1,
  ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
  // ai-entities
  IRetrieveAiEntitiesByQueryWithValuesParamsV1,
  IRetrieveAiEntitiesByQueryWithValuesResponseV1,
  IRetrieveAiEntitiesByQueryParamsV1,
  IRetrieveAiEntitiesByQueryResponseV1,
  ISynchroniseAiEntitiesWithinAiSkillParamsV1,
  // ai-intents
  IRetrieveAiIntentsByQueryParamsV1,
  IRetrieveAiIntentsByQueryResponseV1,
  IRetrieveAiIntentsByQueryWithExamplesParamsV1,
  IRetrieveAiIntentsByQueryWithExamplesResponseV1,
  ISynchroniseAiIntentsWithinAiSkillParamsV1,
  // ai-service-logs
  IRetrieveAiServiceLogsByQueryParamsV1,
  IRetrieveAiServiceLogsByQueryResponseV1,
  // ai-services
  IRetrieveAiServicesByQueryParamsV1,
  IRetrieveAiServicesByQueryResponseV1,
  // ai-skills
  IRetrieveAiSkillsByQueryParamsV1,
  IRetrieveAiSkillsByQueryResponseV1,
  ISaveAiSkillResponseV1,
  ISaveAiSkillParamsV1,
  ICheckAiSkillsByIdsForStatusAvailableResponseV1,
  ICheckAiSkillsByIdsForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableParamsV1,
  ICheckAiSkillByIdForStatusAvailableResponseV1,
  ICountAiSkillsByQueryResponseV1,
  ICountAiSkillsByQueryParamsV1,
  IDeleteAiSkillsByIdsParamsV1,
  IDeleteAiSkillsByIdsResponseV1,
  IDeleteAiSkillByIdResponseV1,
  IDeleteAiSkillByIdParamsV1,
  IRetrieveAiSkillByIdParamsV1,
  IRetrieveAiSkillByIdResponseV1,
  ISynchroniseAiSkillParamsV1,
  // messages
  ISendMessageParamsV1,
  ISendMessageResponseV1,
  // user-data
  IDeleteUserDataByConversationIdParamsV1,
  IDeleteUserDataByConversationIdResponseV1,
  IDeleteUserDataByUserIdParamsV1,
  IDeleteUserDataByUserIdResponseV1,
} from '../types';

export interface IAiServiceClientV1 {

  initialise(): Promise<void>;

  get changeRequest(): {
    retrieveSkill(
      context: IContextV1,
      params: IRetrieveSkillParamsV1,
    ): Promise<IRetrieveSkillsResponseV1>,
    formatIntents(
      context: IContextV1,
      params: IFormatIntentsParamsV1,
    ): Promise<IFormatIntentsResponseV1>,
    importSkills(
      context: IContextV1,
      params: IImportSkillsParamsV1,
    ): Promise<void>,
  }

  get dialogNodes(): {
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiDialogNodesByQueryParamsV1,
    ): Promise<IRetrieveAiDialogNodesByQueryResponseV1>,
    synchroniseWithinAiSkill(
      context: IContextV1,
      params: ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
    ): Promise<void>,
  }

  get entities(): {
    retrieveManyByQueryWithValues(
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryWithValuesResponseV1>,
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryResponseV1>,
    synchroniseWithinAiSkill(
      context: IContextV1,
      params: ISynchroniseAiEntitiesWithinAiSkillParamsV1,
    ): Promise<void>,
  }

  get intents(): {
    retrieveManyByQueryWithExamples(
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryWithExamplesParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryWithExamplesResponseV1>,
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryResponseV1>,
    synchroniseWithinAiSkill(
      context: IContextV1,
      params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
    ): Promise<void>,
  }

  get serviceLogs(): {
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiServiceLogsByQueryParamsV1,
    ): Promise<IRetrieveAiServiceLogsByQueryResponseV1>,
  }

  get services(): {
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiServicesByQueryParamsV1,
    ): Promise<IRetrieveAiServicesByQueryResponseV1>,
  }

  get skills(): {
    saveOne(
      context: IContextV1,
      params: ISaveAiSkillParamsV1,
    ): Promise<ISaveAiSkillResponseV1>,
    checkManyByIdsForStatusAvailable(
      context: IContextV1,
      params: ICheckAiSkillsByIdsForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillsByIdsForStatusAvailableResponseV1>,
    checkOneByIdForStatusAvailable(
      context: IContextV1,
      params: ICheckAiSkillByIdForStatusAvailableParamsV1,
    ): Promise<ICheckAiSkillByIdForStatusAvailableResponseV1>,
    countManyByQuery(
      context: IContextV1,
      params: ICountAiSkillsByQueryParamsV1,
    ): Promise<ICountAiSkillsByQueryResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      params: IDeleteAiSkillsByIdsParamsV1,
    ): Promise<IDeleteAiSkillsByIdsResponseV1>,
    deleteOneById(
      context: IContextV1,
      params: IDeleteAiSkillByIdParamsV1,
    ): Promise<IDeleteAiSkillByIdResponseV1>,
    retrieveManyByQuery(
      context: IContextV1,
      params: IRetrieveAiSkillsByQueryParamsV1,
    ): Promise<IRetrieveAiSkillsByQueryResponseV1>,
    retrieveOneById(
      context: IContextV1,
      params: IRetrieveAiSkillByIdParamsV1,
    ): Promise<IRetrieveAiSkillByIdResponseV1>,
    syncOne(
      context: IContextV1,
      params: ISynchroniseAiSkillParamsV1,
    ): Promise<IAiSkillV1>;
  }

  get messages(): {
    sendOneForTest(
      context: IContextV1,
      params: ISendMessageParamsV1,
    ): Promise<ISendMessageResponseV1>
    sendOne(
      context: IContextV1,
      params: ISendMessageParamsV1,
    ): Promise<ISendMessageResponseV1>,
  }

  get userData(): {
    deleteManyByConversationId(
      context: IContextV1,
      params: IDeleteUserDataByConversationIdParamsV1,
    ): Promise<IDeleteUserDataByConversationIdResponseV1>,
    deleteManyByUserId(
      context: IContextV1,
      params: IDeleteUserDataByUserIdParamsV1,
    ): Promise<IDeleteUserDataByUserIdResponseV1>
  }

}
