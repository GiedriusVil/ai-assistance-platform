import {
  IAiTranslationModelExampleV1,
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IAiTranslationPromptV1,
  IAiTranslationServiceExternalWatsonxV1,
  IAiTranslationServiceExternalWLTV1,
} from "@ibm-aiap/aiap--types-server"

import {
  IAiTranslationModelsChangesV1,
  IAiTranslationServicesChangesV1
} from "../models"

export interface IAiTranslationModelExamplesFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
    aiTranslationModelId?: string,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
}

export interface IAiTranslationModelExamplesFindManyByQueryResponseV1 {
  items: Array<IAiTranslationModelExampleV1>,
  total: number
}

export interface IAiTranslationModelExamplesDeleteManyByIdsParamsV1 {
  ids: Array<string>, 
  modelIds?: Array<string>, 
  serviceIds?: Array<string>,
  options?: Array<string>
}

export interface IAiTranslationModelExamplesDeleteManyByIdsResponseV1 {
  status: string
}

export interface IAiTranslationModelExamplesFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationModelExamplesFindOneByIdResponseV1 extends IAiTranslationModelExampleV1 { }

export interface IAiTranslationModelExamplesSaveOneParamsV1 {
  value: {
    id?: string,
    source?: string,
    target?: string,
  },
}

export interface IAiTranslationModelExamplesSaveOneResponseV1 extends IAiTranslationModelExampleV1 { }

export interface IAiTranslationModelExamplesImportManyParamsV1 {
  file: any,
  aiTranslationServiceId?: string,
  aiTranslationModelId?: string,
}

export interface IAiTranslationModelExamplesImportManyResponseV1 { 
  status: string,
}

export interface IAiTranslationModelExamplesSaveManyParamsV1 {
  aiTranslationModelExamples: Array<IAiTranslationModelExampleV1>,
}

export interface IAiTranslationModelExamplesSaveManyResponseV1 {
  status: string,
}

export interface IAiTranslationModelsDeleteManyByIdsParamsV1 {
  ids: Array<string>, 
  serviceIds?: Array<string>,
  options?: Array<string>
}

export interface IAiTranslationModelsDeleteManyByIdsResponseV1 {
  status: string
}


export interface IAiTranslationModelsDeleteManyByServiceIdParamsV1 {
  aiTranslationServiceId: string
}

export interface IAiTranslationModelsDeleteManyByServiceIdResponseV1 {
  status: string
}

export interface IAiTranslationModelsDeleteManyByServiceModelIdsParamsV1 {
  ids: Array<string>,
  aiTranslationServiceId: string
}

export interface IAiTranslationModelsDeleteManyByServiceModelIdsResponseV1 {
  status: string
}

export interface IAiTranslationModelsFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
    aiTranslationServiceId?: string,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
}

export interface IAiTranslationModelsFindManyByQueryResponseV1 {
  items: Array<IAiTranslationModelV1>,
  total: number
}

export interface IAiTranslationModelsFindOneByQueryParamsV1 {
  filter?: {
    search?: string,
    aiTranslationModelId?: string,
    aiTranslationServiceId?: string,
    source?: string,
    target?: string,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
  options?: {
    refreshStatus?: boolean
  },
}

export interface IAiTranslationModelsFindOneByQueryResponseV1 extends IAiTranslationModelV1 { }

export interface IAiTranslationModelsFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationModelsFindOneByIdResponseV1 extends IAiTranslationModelV1 { }

export interface IAiTranslationModelsSaveOneParamsV1 {
  value: {
    id?: string
  }
}

export interface IAiTranslationModelsSaveOneResponseV1 extends IAiTranslationModelV1 { }

export interface IAiTranslationModelsChangesFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
    dateRange?: any,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
}

export interface IAiTranslationModelsChangesFindManyByQueryResponseV1 {
  items: Array<IAiTranslationModelsChangesV1>,
  total: number
}

export interface IAiTranslationModelsChangesFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationModelsChangesFindOneByIdResponseV1 extends IAiTranslationModelsChangesV1 { }

export interface IAiTranslationModelsChangesSaveOneParamsV1 {
  action?: string,
  docType?: string,
  value: {
    id?: string,
    name?: string,
    source?: string,
    target?: string,
  },
  docChanges?: string,
  
}

export interface IAiTranslationModelsChangesSaveOneResponseV1 extends IAiTranslationModelsChangesV1{ }

export interface IAiTranslationServicesFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  }
}

export interface IAiTranslationServicesFindManyByQueryResponseV1 { 
  items: Array<IAiTranslationServiceV1>,
  total: number
}

export interface IAiTranslationServicesDeleteManyByIdsParamsV1 {
  ids: Array<string>
}

export interface IAiTranslationServicesDeleteManyByIdsResponseV1 {
  ids: Array<string>,
  status: string
}

export interface IAiTranslationServicesFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationServicesFindOneByIdResponseV1 extends IAiTranslationServiceV1 { }

export interface IAiTranslationServicesSaveOneParamsV1 {
  value: {
    id?: string,
    name?: string,
    type?: string,
    external?: IAiTranslationServiceExternalWLTV1 | IAiTranslationServiceExternalWatsonxV1,
  }
}

export interface IAiTranslationServicesSaveOneResponseV1 extends IAiTranslationServiceV1 { }

export interface IAiTranslationServicesChangesFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
    dateRange?: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  }
}

export interface IAiTranslationServicesChangesFindManyByQueryResponseV1 { 
  items: Array<IAiTranslationServicesChangesV1>,
  total: number
}

export interface IAiTranslationServicesChangesFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationServicesChangesFindOneByIdResponseV1 extends IAiTranslationServicesChangesV1 { }

export interface IAiTranslationServicesChangesSaveOneParamsV1 {
  action?: string,
  docType?: string,
  value: {
    id?: string,
    name?: string,
  },
  docChanges?: string,
  source?: string,
}

export interface IAiTranslationServicesChangesSaveOneResponseV1 extends IAiTranslationServicesChangesV1 { }

export interface IAiTranslationModelsIdentifyLanguageByIdParamsV1 {
  aiTranslationServiceId?: string,
  text?: string
}

export interface IAiTranslationModelsIdentifyLanguageByIdResponseV1 {
  languages: Array<{
    language: string,
    confidence: any
  }>,
  external: any
}

export interface IAiTranslationModelsImportManyParamsV1 {
  file: any,
  aiTranslationServiceId: string,
}

export interface IAiTranslationModelsImportManyResponseV1 { 
  status: string
}

export interface IAiTranslationModelsTrainOneByServiceModelIdParamsV1 {
  aiTranslationServiceId: string,
  aiTranslationModelId: string
}

export interface IAiTranslationModelsTrainOneByServiceModelIdResponseV1 extends IAiTranslationModelV1 { }

export interface IAiTranslationModelsTranslateTextByServiceModelIdParamsV1 {
  aiTranslationServiceId: string,
  aiTranslationModelId: string,
  text: any
}

export interface IAiTranslationModelsTranslateTextByServiceModelIdResponseV1 {
  translation: {
    text: any,
  },
  external: any,
}

export interface IAiTranslationPromptsDeleteManyByIdsParamsV1 {
  ids: Array<string>,
  serviceIds?: Array<string>,
  options?: Array<string>
}

export interface IAiTranslationPromptsDeleteManyByIdsResponseV1 {
  status: string
}

export interface IAiTranslationPromptsDeleteManyByPromptIdsParamsV1 {
  ids: Array<string>,
  serviceIds?: Array<string>
}

export interface IAiTranslationPromptsDeleteManyByPromptIdsResponseV1 {
  status: string
}

export interface IAiTranslationPromptsDeleteManyByServiceIdParamsV1 {
  aiTranslationServiceId: string
}

export interface IAiTranslationPromptsDeleteManyByServiceIdResponseV1 {
  status: string
}

export interface IAiTranslationPromptsFindManyByQueryParamsV1 {
  filter?: {
    search?: string,
    aiTranslationServiceId?: string,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
}

export interface IAiTranslationPromptsFindManyByQueryResponseV1 {
  items: Array<IAiTranslationPromptV1>,
  total: number
}

export interface IAiTranslationPromptsFindOneByIdParamsV1 {
  id: string
}

export interface IAiTranslationPromptsFindOneByIdResponseV1 extends IAiTranslationPromptV1 { }

export interface IAiTranslationPromptsFindOneByQueryParamsV1 {
  filter?: {
    search?: string,
    aiTranslationPromptId?: string,
    aiTranslationServiceId?: string,
    source?: string,
    target?: string,
    [key: string]: any,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  },
  options?: {
    refreshStatus?: boolean
  },
}

export interface IAiTranslationPromptsFindOneByQueryResponseV1 extends IAiTranslationPromptV1 { }

export interface IAiTranslationPromptsFindSupportedLanguagesParamsV1 { }

export interface IAiTranslationPromptsImportManyParamsV1 {
  file: any,
  aiTranslationServiceId: string,
}

export interface IAiTranslationPromptsImportManyResponseV1 { 
  status: string
}

export interface IAiTranslationPromptsSaveOneParamsV1 {
  value: {
    id?: string
  }
}

export interface IAiTranslationPromptsSaveOneResponseV1 extends IAiTranslationPromptV1 { }

export interface IAiTranslationPromptsTranslateTextByPromptIdParamsV1 {
  aiTranslationServiceId: string,
  aiTranslationPromptId: string,
  text: any
}

export interface IAiTranslationPromptsTranslateTextByServicePromptIdResponseV1 {
  translation: {
    text: any,
  },
  external: any,
}

export interface IAiTranslationServicesExportManyParamsV1 {
  filter?: {
    search?: string,
    aiTranslationServiceId?: string,
  },
  sort?: {
    field: string,
    direction: string,
  },
  pagination: {
    page: any,
    size: any,
  }
}

export interface IAiTranslationServicesExportManResponseV1 extends Array<IAiTranslationServiceV1> { }

export interface IAiTranslationServicesImportManyParamsV1 {
  file: any,
}

export interface IAiTranslationServicesImportManyResponseV1 { 
  status: string
}
