export interface IAiTranslationModelExamplesDeleteManyByIdsParamsV1 {
  ids: Array<string>
}

export interface IAiTranslationModelExamplesFindManyByQueryParamsV1 {
  query: {
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
    }
  }
}
