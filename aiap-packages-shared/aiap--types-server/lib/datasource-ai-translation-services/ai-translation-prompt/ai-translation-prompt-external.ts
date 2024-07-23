/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IAiTranslationPromptExternalWatsonxV1 {
  parameters?: ILLMParams,
  model_id?: string,
  project_id?: string,
  input?: string,
  prompt?: string,
}

export interface ILLMParams {
  prompt_variables?: object,
  decoding_method?: string,
  max_new_tokens?: number,
  min_new_tokens?: number,
  repetition_penalty?: number,
  stop_sequences?: string[],
  temperature?: number,
  top_p?: number,
  typical_p?: number,
  top_k?: number,
  random_seed?: number,
}
