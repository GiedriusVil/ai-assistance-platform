/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const datasource = (
  flatResource: {
    resourceName: any,
    resourceMethod: any,
  },
) => {
  const RET_VAL = {
    name: flatResource?.resourceName,
    method: flatResource?.resourceMethod,
  }
  return RET_VAL;
}
const resources = (
  flatResources: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatResources)
  ) {
    for (const FLAT_RESOURCE of flatResources) {
      if (
        !ramda.isNil(FLAT_RESOURCE)
      ) {
        RET_VAL.push(datasource(FLAT_RESOURCE));
      }
    }
  }
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RESOURCES_FLAT = provider.getKeys(
    'TENANTS_RESOURCES_LOADER',
    [
      'RESOURCE_NAME',
      'RESOURCE_METHOD',
    ]
  );
  const RESOURCES = resources(RESOURCES_FLAT);
  const TENANTS_RESOURCES_LOADER_INDEX_BY_EXT_ID_ENABLED = provider.isEnabled('TENANTS_RESOURCES_LOADER_INDEX_BY_EXT_ID_ENABLED', false);

  const RET_VAL = provider.isEnabled('TENANTS_RESOURCES_LOADER_ENABLED', false, {
    indexByExternalId: TENANTS_RESOURCES_LOADER_INDEX_BY_EXT_ID_ENABLED || false,
    resources: RESOURCES
  });
  return RET_VAL;
}
