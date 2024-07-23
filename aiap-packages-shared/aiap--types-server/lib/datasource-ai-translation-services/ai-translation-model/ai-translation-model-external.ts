/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface IAiTranslationModelExternalWLTV1 {
  model_id?: string,
  source?: string,
  target?: string,
  base_model_id?: string,
  domain?: string,
  customizable?: boolean,
  default_model?: boolean,
  owner: string,
  status?: string,
  name?: string,
  training_log?: string,
}
