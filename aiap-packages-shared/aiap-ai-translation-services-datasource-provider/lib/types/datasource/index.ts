/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationServicesDeleteManyByIdsParamsV1,
  IAiTranslationServicesDeleteManyByIdsResponseV1,
  IAiTranslationServicesFindManyByQueryParamsV1,
  IAiTranslationServicesFindManyByQueryResponseV1,
  IAiTranslationServicesFindOneByIdParamsV1,
  IAiTranslationServicesFindOneByIdResponseV1,
  IAiTranslationServicesSaveOneParamsV1,
  IAiTranslationServicesSaveOneResponseV1,
  //
  IAiTranslationServicesChangesFindManyByQueryParamsV1,
  IAiTranslationServicesChangesFindManyByQueryResponseV1,
  IAiTranslationServicesChangesFindOneByIdParamsV1,
  IAiTranslationServicesChangesFindOneByIdResponseV1,
  IAiTranslationServicesChangesSaveOneParamsV1,
  IAiTranslationServicesChangesSaveOneResponseV1,
  //
  IAiTranslationModelsDeleteManyByIdsParamsV1,
  IAiTranslationModelsDeleteManyByIdsResponseV1,
  IAiTranslationModelsFindManyByQueryParamsV1,
  IAiTranslationModelsFindManyByQueryResponseV1,
  IAiTranslationModelsFindOneByIdParamsV1,
  IAiTranslationModelsFindOneByIdResponseV1,
  IAiTranslationModelsFindOneByQueryParamsV1,
  IAiTranslationModelsFindOneByQueryResponseV1,
  IAiTranslationModelsSaveOneParamsV1,
  IAiTranslationModelsSaveOneResponseV1,
  //
  IAiTranslationModelExamplesSaveOneResponseV1,
  IAiTranslationModelsChangesFindManyByQueryParamsV1,
  IAiTranslationModelsChangesFindManyByQueryResponseV1,
  IAiTranslationModelsChangesFindOneByIdParamsV1,
  IAiTranslationModelsChangesFindOneByIdResponseV1,
  IAiTranslationModelsChangesSaveOneParamsV1,
  IAiTranslationModelsChangesSaveOneResponseV1,
  //
  IAiTranslationModelExamplesDeleteManyByIdsParamsV1,
  IAiTranslationModelExamplesDeleteManyByIdsResponseV1,
  IAiTranslationModelExamplesFindManyByQueryParamsV1,
  IAiTranslationModelExamplesFindManyByQueryResponseV1,
  IAiTranslationModelExamplesFindOneByIdParamsV1,
  IAiTranslationModelExamplesFindOneByIdResponseV1,
  IAiTranslationModelExamplesSaveOneParamsV1,
  //
  IAiTranslationPromptsDeleteManyByIdsParamsV1,
  IAiTranslationPromptsDeleteManyByIdsResponseV1,
  IAiTranslationPromptsFindManyByQueryParamsV1,
  IAiTranslationPromptsFindManyByQueryResponseV1,
  IAiTranslationPromptsFindOneByIdParamsV1,
  IAiTranslationPromptsFindOneByIdResponseV1,
  IAiTranslationPromptsFindOneByQueryParamsV1,
  IAiTranslationPromptsFindOneByQueryResponseV1,
  IAiTranslationPromptsSaveOneParamsV1,
  IAiTranslationPromptsSaveOneResponseV1,
} from '..';


interface IDatasourceTranslationServicesV1 {

  get aiTranslationServices(): {
    
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationServicesFindManyByQueryParamsV1
    ): Promise<IAiTranslationServicesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationServicesFindOneByIdParamsV1
    ): Promise<IAiTranslationServicesFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationServicesSaveOneParamsV1
    ): Promise<IAiTranslationServicesSaveOneResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      param: IAiTranslationServicesDeleteManyByIdsParamsV1
    ): Promise<IAiTranslationServicesDeleteManyByIdsResponseV1>,
    
  }

  get aiTranslationServicesChanges(): {
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationServicesChangesFindManyByQueryParamsV1
    ): Promise<IAiTranslationServicesChangesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationServicesChangesFindOneByIdParamsV1
    ): Promise<IAiTranslationServicesChangesFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationServicesChangesSaveOneParamsV1
    ): Promise<IAiTranslationServicesChangesSaveOneResponseV1>,
  }

  get aiTranslationModels(): {
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationModelsFindManyByQueryParamsV1
    ): Promise<IAiTranslationModelsFindManyByQueryResponseV1>,
    findOneByQuery(
      context: IContextV1,
      param: IAiTranslationModelsFindOneByQueryParamsV1
    ): Promise<IAiTranslationModelsFindOneByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationModelsFindOneByIdParamsV1
    ): Promise<IAiTranslationModelsFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationModelsSaveOneParamsV1
    ): Promise<IAiTranslationModelsSaveOneResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      param: IAiTranslationModelsDeleteManyByIdsParamsV1
    ): Promise<IAiTranslationModelsDeleteManyByIdsResponseV1>,
  }

  get aiTranslationModelsChanges(): {
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationModelsChangesFindManyByQueryParamsV1
    ): Promise<IAiTranslationModelsChangesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationModelsChangesFindOneByIdParamsV1
    ): Promise<IAiTranslationModelsChangesFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationModelsChangesSaveOneParamsV1
    ): Promise<IAiTranslationModelsChangesSaveOneResponseV1>,
  }

  get aiTranslationModelExamples(): {
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationModelExamplesFindManyByQueryParamsV1
    ): Promise<IAiTranslationModelExamplesFindManyByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationModelExamplesFindOneByIdParamsV1
    ): Promise<IAiTranslationModelExamplesFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationModelExamplesSaveOneParamsV1
    ): Promise<IAiTranslationModelExamplesSaveOneResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      param: IAiTranslationModelExamplesDeleteManyByIdsParamsV1
    ): Promise<IAiTranslationModelExamplesDeleteManyByIdsResponseV1>,
  }

  get aiTranslationPrompts(): {
    findManyByQuery(
      context: IContextV1,
      param: IAiTranslationPromptsFindManyByQueryParamsV1
    ): Promise<IAiTranslationPromptsFindManyByQueryResponseV1>,
    findOneByQuery(
      context: IContextV1,
      param: IAiTranslationPromptsFindOneByQueryParamsV1
    ): Promise<IAiTranslationPromptsFindOneByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      param: IAiTranslationPromptsFindOneByIdParamsV1
    ): Promise<IAiTranslationPromptsFindOneByIdResponseV1>,
    saveOne(
      context: IContextV1,
      param: IAiTranslationPromptsSaveOneParamsV1
    ): Promise<IAiTranslationPromptsSaveOneResponseV1>,
    deleteManyByIds(
      context: IContextV1,
      param: IAiTranslationPromptsDeleteManyByIdsParamsV1
    ): Promise<IAiTranslationPromptsDeleteManyByIdsResponseV1>,
  }
}

export {
  IDatasourceTranslationServicesV1,
}
