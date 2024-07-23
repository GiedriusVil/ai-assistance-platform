/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-app-datasource-mongo';
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
  IDatasourceAppV1,
  IDatasourceConfigurationV1App,
  IDatasourceAppCollectionsV1,
} from '../types';

import {
  sanitizedCollectionsFromConfiguration,
} from './collections-utils';

import { _accessGroups } from './access-groups';
import { _accessGroupsChanges } from './access-groups-changes';
import { _applications } from './applications';
import { _applicationChanges } from './applications-changes';
import { _tenants } from './tenants';
import { _tenantsChanges } from './tenants-changes';
import { _users } from './users';
import { _usersChanges } from './users-changes';

export class DatasourceAppV1Mongo
  extends BaseDatasourceMongoV1<IDatasourceConfigurationV1App>
  implements IDatasourceAppV1 {

  _collections: IDatasourceAppCollectionsV1;

  constructor(
    configuration: IDatasourceConfigurationV1App,
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
    await this._ensureDefaults()
  }

  async _ensureIndexes() {
    try {
      const COLLECTIONS = this._collections;
      const DB = await this._getDB();
      await createIndex(DB, COLLECTIONS.users, { username: 1 });
      await createIndex(DB, COLLECTIONS.tenants, { externalId: 1 });
      logger.info(`${this._ensureIndexes.name} - SUCCESS`);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async _ensureDefaults() {
    try {
      if (
        this.configuration?.users
      ) {
        const CONTEXT = { user: { id: 'SYSTEM' } };
        const PARAMS = {
          users: this.configuration?.users,
        };

        await _users(this).ensureDefaults(CONTEXT, PARAMS);
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this._ensureDefaults.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get accessGroups() {
    const RET_VAL = _accessGroups(this);
    return RET_VAL;
  }

  get accessGroupsChanges() {
    const RET_VAL = _accessGroupsChanges(this);
    return RET_VAL;
  }

  get applications() {
    const RET_VAL = _applications(this);
    return RET_VAL;
  }

  get applicationsChanges() {
    const RET_VAL = _applicationChanges(this);
    return RET_VAL;
  }

  get tenants() {
    const RET_VAL = _tenants(this);
    return RET_VAL;
  }

  get tenantsChanges() {
    const RET_VAL = _tenantsChanges(this);
    return RET_VAL;
  }

  get users() {
    const RET_VAL = _users(this);
    return RET_VAL;
  }

  get usersChanges() {
    const RET_VAL = _usersChanges(this);
    return RET_VAL;
  }

}
