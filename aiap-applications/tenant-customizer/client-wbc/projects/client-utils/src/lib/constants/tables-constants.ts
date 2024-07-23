/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  TABLE_SORT_DIRECTION,
} from 'client-shared-utils';

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DEFAULT_TABLE = {
  PAGE: {
    ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100]
  },
  AUDIO_VOICE_SERVICES_V1: {
    TYPE: 'audioVoiceServices',
    SORT:
    {
      field: 'created',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  TOPIC_MODELING_V1: {
    TYPE: 'topicModeling',
    SORT:
    {
      field: 'created',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  UNSPSC_SEGMENTS: {
    TYPE: 'UNSPSCSegments',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
  CLASSIFICATION_CATALOGS_V1: {
    TYPE: 'classificationCatalogs',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  ENGAGEMENTS_CHANGES_V1: {
    TYPE: 'engagementsChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  ENGAGEMENTS_V1: {
    TYPE: 'engagements',
    SORT: {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  AI_SERVICES_CHANGES_V1: {
    TYPE: 'aiServicesChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_SERVICES_CHANGE_REQUEST_V1: {
    TYPE: 'aiServicesChangeRequest',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  OBJECT_STORAGE_BUCKETS_V1: {
    TYPE: 'obectStorageBucketsV1',
    SORT: {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.ASC,
    }
  },
  OBJECT_STORAGE_BUCKETS_CHANGES_V1: {
    TYPE: 'obectStorageBucketsChangesV1',
    SORT: {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.ASC,
    }
  },
  OBJECT_STORAGE_FILES_V1: {
    TYPE: 'obectStorageFilesV1',
    SORT: {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.ASC,
    }
  },
  OBJECT_STORAGE_FILES_CHANGES_V1: {
    TYPE: 'obectStorageFilesChangesV1',
    SORT: {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.ASC,
    }
  },
  AI_SERVICES: {
    TYPE: 'AI_SERVICES',
    SORT: {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.ASC,
    },
  },
  AI_SKILLS_V1: {
    TYPE: 'AI_SKILLS_V1',
    SORT: {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.ASC,
    },
  },
  AI_SKILLS_RELEASES: {
    TYPE: 'AI_SKILLS_RELEASES',
    SORT: {
      field: 'createdT',
      direction: TABLE_SORT_DIRECTION.ASC,
    },
    PAGINATION: {
      page: 1,
      size: 5
    },
    ITEMS_PER_PAGE_OPTIONS: [5]
  },
  LAMBDA: {
    TYPE: 'Lambda',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  LAMBDA_CHANGES: {
    TYPE: 'LambdaChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  LAMBDA_CONFIGURATIONS: {
    TYPE: 'LambdaConfigurations',
    SORT:
    {
      field: 'key',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  LAMBDA_ERRORS: {
    TYPE: 'LambdaErrors',
    SORT:
    {
      field: 'timestamp',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_SEARCH_AND_ANALYSIS_SERVICES_V1: {
    TYPE: 'AiSearchAndAnalysisServices',
    SORT:
    {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_SEARCH_AND_ANALYSIS_PROJECTS_V1: {
    TYPE: 'AiSearchAndAnalysisProjects',
    SORT:
    {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_SEARCH_AND_ANALYSIS_DOCUMENTS_V1: {
    TYPE: 'AiSearchAndAnalysisDocuments',
    SORT:
    {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_SEARCH_AND_ANALYSIS_COLLECTIONS_V1: {
    TYPE: 'AiSearchAndAnalysisCollections',
    SORT:
    {
      field: 'name',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  ANSWER_STORES: {
    TYPE: 'AnswerStores',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC,
    },
  },
  ANSWERS: {
    TYPE: 'Answers',
    SORT:
    {
      field: 'key',
      direction: TABLE_SORT_DIRECTION.DESC,
    },
  },
  AI_TRANSLATION_SERVICES_CHANGES_V1: {
    TYPE: 'aiTranslationServicesChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_MODELS_CHANGES_V1: {
    TYPE: 'aiTranslationModelsChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
  DATA_MASKING_CONFIGURATIONS_V1: {
    TYPE: 'DataMaskingConfigurations',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC
    }
  },
  JOBS_QUEUES_V1: {
    TYPE: 'JobsQueues',
    SORT:
      {
        field: 'name',
        direction: SORT_DIRECTION.DESC
      }
  },
  AI_TRANSLATION_SERVICES_V1: {
    TYPE: 'AiTranslationServices',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_MODELS_V1: {
    TYPE: 'AiTranslationModels',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_PROMPTS_V1: {
    TYPE: 'AiTranslationPrompts',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_MODEL_EXAMPLES_V1: {
    TYPE: 'AiTranslationModelExamples',
    SORT:
    {
      field: 'source',
      direction: SORT_DIRECTION.ASC
    }
  },
  AI_TRANSLATION_PROMPT_CONFIGURATION_V1: {
    TYPE: 'AiTranslationPrompt',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.ASC
    }
  },
  CLASSIFIER_MODELS_CHANGES_V1: {
    TYPE: 'ClassifierModelsChanges',
    SORT:
    {
      field: 'id',
      direction: TABLE_SORT_DIRECTION.DESC
    }
  },
};
