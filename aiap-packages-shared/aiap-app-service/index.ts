/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const DEFAULT_ACCESS_GROUPS = require('./lib/data/default-access-groups.json');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
  getLibConfiguration,
} from './lib/configuration';

import {
  accessGroupsService,
  accessGroupsChangesService,
  applicationsService,
  applicationsChangesService,
  runtimeDataService,
  connectionsService,
  tenantsService,
  tenantsChangesService,
  translationsService,
  userSessionsService,
  usersService,
  usersChangesService,
} from './lib/api';

const initByConfigurationProvider = async (
  provider: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const ERROR_MESSAGE = 'Provider configuration provider! [aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    setConfigurationProvider(provider);
    const CONTEXT = {
      user: {
        id: 'system',
        username: 'system',
      },
    };

    let defaultAccessGroups;
    const LIB_CONFIGURATION = getLibConfiguration();
    const ENSURE_DEFAULT_ACCESS_GROUPS = LIB_CONFIGURATION?.default?.accessGroups;

    if (
      ENSURE_DEFAULT_ACCESS_GROUPS
    ) {
      defaultAccessGroups = await accessGroupsService.saveMany(
        CONTEXT,
        {
          values: DEFAULT_ACCESS_GROUPS
        }
      );

    } else {
      logger.warn(`${initByConfigurationProvider.name} - WARN - missing default access groups configuration!`);
    }
    if (
      lodash.isArray(defaultAccessGroups)
    ) {
      const DEFAULT_ACCESS_GROUPS_IDS = defaultAccessGroups.map((item: any) => {
        return item?.id;
      });
      logger.info(initByConfigurationProvider.name, { DEFAULT_ACCESS_GROUPS_IDS });
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  initByConfigurationProvider,
  accessGroupsService,
  accessGroupsChangesService,
  applicationsService,
  applicationsChangesService,
  connectionsService,
  runtimeDataService,
  tenantsService,
  tenantsChangesService,
  translationsService,
  userSessionsService,
  usersService,
  usersChangesService,
}
