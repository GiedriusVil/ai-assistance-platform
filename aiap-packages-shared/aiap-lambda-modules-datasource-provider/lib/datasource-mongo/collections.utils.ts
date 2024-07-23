/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

const DEFAULT_COLLECTIONS = {
  modules: 'lambdaModules',
  modulesReleases: 'lambdaModulesReleases',
  modulesConfigurations: 'lambdaModulesConfigurations'
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const MODULES = COLLECTIONS_CONFIGURATION?.modules;
  const MODULES_RELEASES = COLLECTIONS_CONFIGURATION?.modulesReleases;
  const MODULES_CONFIGURATIONS = COLLECTIONS_CONFIGURATION?.modulesConfigurations;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(MODULES)
  ) {
    RET_VAL.modules = MODULES;
  }
  if (
    !lodash.isEmpty(MODULES_RELEASES)
  ) {
    RET_VAL.modulesReleases = MODULES_RELEASES;
  }
  if (
    !lodash.isEmpty(MODULES_CONFIGURATIONS)
  ) {
    RET_VAL.modulesConfigurations = MODULES_CONFIGURATIONS;
  }
  return RET_VAL;
}


export {
  sanitizedCollectionsFromConfiguration,
};
