/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  createIndex
} from '@ibm-aiap/aiap-utils-mongo';

import {
  BaseDatasourceMongoV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceAiServicesV1,
  IDatasourceConfigurationAiServicesV1,
  IDatasourceAiServicesCollectionsV1,
} from '../types';

import {
  sanitizedCollectionsFromConfiguration,
} from './collections-utils';

import { _aiServiceTests } from './ai-service-tests';
import { _aiServices } from './ai-services';
import { _aiServicesChanges } from './ai-services-changes'
import { _aiSkillReleases } from './ai-skill-releases';
import { _aiSkills } from './ai-skills';
import { _aiServicesChangeRequest } from './ai-services-change-request';

export class AiServicesDatasourceMongoV1
  extends BaseDatasourceMongoV1<IDatasourceConfigurationAiServicesV1>
  implements IDatasourceAiServicesV1 {

  _collections: IDatasourceAiServicesCollectionsV1;

  constructor(
    configuration: IDatasourceConfigurationAiServicesV1,
  ) {
    super(configuration);
    try {
      this.configuration.encryptionKey = 'someKey';
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const COLLECTIONS = this._collections;
      const DB = await this._getDB();
      await createIndex(DB, COLLECTIONS.aiServices, { assistantId: 1 });
      await createIndex(DB, COLLECTIONS.aiServices, { id: 1 });
      await createIndex(DB, COLLECTIONS.aiSkills, { 'external.dialog_nodes.output.generic.values.text': 1 });
      await createIndex(DB, COLLECTIONS.aiSkills, { 'external.dialog_nodes.output.generic.values.text': 'text' });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get aiServiceTests() {
    const RET_VAL = _aiServiceTests(this);
    return RET_VAL;
  }

  get aiServices() {
    const RET_VAL = _aiServices(this);
    return RET_VAL;
  }

  get aiServicesChanges() {
    const RET_VAL = _aiServicesChanges(this);
    return RET_VAL;
  }

  get aiSkillReleases() {
    const RET_VAL = _aiSkillReleases(this);
    return RET_VAL;
  }

  get aiSkills() {
    const RET_VAL = _aiSkills(this);
    return RET_VAL;
  }

  get aiServicesChangeRequest() {
    const RET_VAL = _aiServicesChangeRequest(this);
    return RET_VAL
  }

}
