/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-cache-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { findManyByQuery } from './find-many-by-query';
import { findMany } from './find-many';
import { findOneByExternalId } from './find-one-by-external-id';
import { findOneByGAcaProps } from './find-one-by-g-aca-props';
import { findOneByIdAndHash } from './find-one-by-id-and-hash';
import { findOneById } from './find-one-by-id';

import { reloadManyByQuery } from './reload-many-by-query';
import { reloadOneByExternalId } from './reload-one-by-external-id';
import { reloadOneById } from './reload-one-by-id';

export class TenantsCacheProviderV1 {

  type: string;

  constructor() {
    this.type = 'TenantsCacheProviderV1';
  }

  async _reloadTenants() {
    const CONTEXT = {};
    const FIND_MANY_BY_QUERY_PARAMS = {
      query: {
        sort: {
          field: 'name',
          direction: 'asc'
        },
        pagination: {
          page: 1,
          size: 1000,
        }
      },
    }
    await reloadManyByQuery(CONTEXT, FIND_MANY_BY_QUERY_PARAMS);
  }


  async initialize() {
    try {
      await this._reloadTenants();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialize.name, {
        ACA_ERROR
      });
      throw ACA_ERROR;
    }
  }

  get tenants() {
    const RET_VAL = {
      findManyByQuery: (params) => {
        return findManyByQuery(params);
      },
      findMany: (params) => {
        return findMany(params);
      },
      findOneById: (params) => {
        return findOneById(params);
      },
      findOneByIdAndHash: (params) => {
        return findOneByIdAndHash(params);
      },
      findOneByExternalId: (params) => {
        return findOneByExternalId(params);
      },
      findOneByGAcaProps: (params) => {
        return findOneByGAcaProps(params);
      },
      reloadManyByQuery: (context, params) => {
        return reloadManyByQuery(context, params);
      },
      reloadOneById: (params) => {
        return reloadOneById(params);
      },
      reloadOneByExternalId: (params) => {
        return reloadOneByExternalId(params);
      },
    };
    return RET_VAL;
  }

}
