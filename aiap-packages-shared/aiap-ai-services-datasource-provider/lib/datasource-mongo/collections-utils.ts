/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IDatasourceConfigurationAiServicesV1,
} from '../types';

const DEFAULT_COLLECTIONS = {
  aiServices: 'aiServices',
  aiServicesChanges: 'aiServicesChanges',
  aiServicesChangeRequest: 'aiServicesChangeRequest',
  aiSkills: 'aiSkills',
  aiSkillReleases: 'aiSkillReleases',
  aiServiceTests: 'aiServiceTests',
};

export const sanitizedCollectionsFromConfiguration = (
  configuration: IDatasourceConfigurationAiServicesV1,
) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const AI_SERVICES = COLLECTIONS_CONFIGURATION?.aiServices;
  const AI_SERVICES_CHANGES = COLLECTIONS_CONFIGURATION?.aiServicesChanges;
  const AI_SERVICES_REQUEST_CHANGE = COLLECTIONS_CONFIGURATION?.aiServicesChangeRequest;
  const AI_SKILLS = COLLECTIONS_CONFIGURATION?.aiSkills;
  const AI_SKILL_RELEASES = COLLECTIONS_CONFIGURATION?.aiSkillReleases;
  const AI_SERVICE_TESTS = COLLECTIONS_CONFIGURATION?.aiServiceTests;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(AI_SERVICES)
  ) {
    RET_VAL.aiServices = AI_SERVICES;
  }
  if (
    !lodash.isEmpty(AI_SERVICES_CHANGES)
  ) {
    RET_VAL.aiServicesChanges = AI_SERVICES_CHANGES;
  }
  if (
    !lodash.isEmpty(AI_SERVICES_REQUEST_CHANGE)
  ) {
    RET_VAL.aiServicesChangeRequest = AI_SERVICES_REQUEST_CHANGE;
  }
  if (
    !lodash.isEmpty(AI_SKILLS)
  ) {
    RET_VAL.aiSkills = AI_SKILLS;
  }
  if (
    !lodash.isEmpty(AI_SKILL_RELEASES)
  ) {
    RET_VAL.aiSkillReleases = AI_SKILL_RELEASES;
  }
  if (
    !lodash.isEmpty(AI_SERVICE_TESTS)
  ) {
    RET_VAL.aiServiceTests = AI_SERVICE_TESTS;
  }
  return RET_VAL;
}
