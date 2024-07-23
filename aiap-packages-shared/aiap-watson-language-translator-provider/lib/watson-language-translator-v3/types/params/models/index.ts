/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ICreateModelParamsV1 {
  baseModelId: string,
  forcedGlossary?: Buffer,
  forcedGlossaryContentType?: string,
  parallelCorpus?: Buffer,
  parallelCorpusContentType?: string,
  name?: string,
  type?: string,
  examples?: any,
}

export interface IListModelsParamsV1 {
  source?: string,
  target?: string,
  _default?: boolean,
  onlyCustomModels?: boolean,
}

export interface IDeleteModelParamsV1 {
  modelId: string,
}

export interface IGetModelParamsV1 {
  modelId: string,
}
