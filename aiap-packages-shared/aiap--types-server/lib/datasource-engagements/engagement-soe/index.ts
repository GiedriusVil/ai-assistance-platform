export interface IEngagementSoeV1 {
  classifier?: {
    model?: {
      id?: string,
    },
  },
  'aca-utils-soe-messages'?: {
    ACA_ERROR?: {
      userIds?: Array<string>,
    },
    ACA_DEBUG?: {
      userIds?: Array<string>,
    },
  },
  aiService?: {
    id?: string,
    aiSkill?: {
      id?: string,
    },
  },
  aiTranslationService?: {
    id?: string,
  }
}
