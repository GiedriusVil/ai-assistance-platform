/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  AiapMongoClientV1,
} from '@ibm-aiap/aiap-mongo-client-provider'

import {
  sanitizedCollectionsFromConfiguration
} from './collections.utils';

import {
  _engagements
} from './engagements';

import {
  _engagementsChanges
} from './engagements-changes';

import {
  BaseDatasourceMongoV1
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceConfigurationEngagementsV1,
  IDatasourceEngagementCollectionsV1,
  IDatasourceEngagementsV1
} from '../types';

export class EngagementsDatasourceMongo
  extends BaseDatasourceMongoV1<IDatasourceConfigurationEngagementsV1>
  implements IDatasourceEngagementsV1 {

  _collections: IDatasourceEngagementCollectionsV1;
  acaMongoClient: AiapMongoClientV1;

  constructor(
    configuration: IDatasourceConfigurationEngagementsV1
  ) {
    super(configuration);
    try {
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
      // 
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get engagements() {
    const RET_VAL = _engagements(this);
    return RET_VAL;
  }

  get engagementsChanges() {
    const RET_VAL = _engagementsChanges(this);
    return RET_VAL;
  }
}
