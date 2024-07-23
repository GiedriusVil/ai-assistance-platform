/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AI_SERVICE_TYPE_ENUM,
} from '../ai-service';

export interface IAiSkillV1 {
  id?: string,
  aiServiceId?: string,
  name?: string,
  type?: AI_SERVICE_TYPE_ENUM,
  unavailableMessage?: string,
  totals?: {
    intents?: number,
    entities?: number,
    dialog_nodes?: number,
    actions?: number,
  },
  created?: any,
  updated?: any,
  external:
  IAiSkillExternalV1AwsLexV2 |
  IAiSkillExternalV1ChatGptV3 |
  IAiSkillExternalV1WaV1 |
  IAiSkillExternalV1WaV2,
  /**
   * @remarks -> LEGO -> Runtime attribute!
   */
  actions?: Array<any>,
  /**
   * @remarks -> LEGO -> Runtime attribute!
   */
  intents?: Array<{
    intent: string,
    examples: Array<{
      text: any,
    }>,
  }>,
  /**
   * @remarks -> LEGO -> Runtime attribute!
   */
  entities?: Array<any>,
  /**
 * @remarks -> LEGO -> Runtime attribute!
 */
  selectedIntent?: any,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiSkillExternalV1AwsLexV2 {
  botSummary?: {
    botId: any,
    botName: any,
  },
  locale: {
    localeId: any,
  },
  intents: Array<{
    intentName: any,
    describe: {
      sampleUtterances: Array<{
        utterance: any,
      }>
    },
  }>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAiSkillExternalV1ChatGptV3 {
}

export interface IAiSkillExternalV1WaV1 {
  name?: string,
  language?: string,
  workspace_id?: any,
  learning_opt_out?: boolean,
  description?: string,
  dialog_nodes?: Array<any>,
  counterexamples?: Array<any>,
  created?: any,
  updated?: any,
  metadata?: any,
  system_settings?: any,
  status?: string,
  status_errors: Array<any>,
  webhooks?: Array<any>,
  intents?: Array<any>,
  entities?: Array<any>,
  counts?: Array<any>,
}

export interface IAiSkillExternalV1WaV2 {
  skill_id?: any,
  name?: any,
  type?: any,
  description?: string,
  status?: string,
  status_errors: Array<any>,
  language?: string,
  workspace?: {
    webhooks?: Array<any>,
    intents?: Array<any>,
    entities?: Array<any>,
    dialog_nodes?: Array<any>,
    actions?: Array<any>,
    counterexamples?: Array<any>,
    metadata?: any,
    learning_opt_out?: boolean,
    system_settings?: any,
    counts?: Array<any>,
  },
}
