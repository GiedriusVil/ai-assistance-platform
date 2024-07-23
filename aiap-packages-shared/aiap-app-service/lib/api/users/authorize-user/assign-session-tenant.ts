/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-authorize-user-retrieve-session-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextTenantV1,
  IContextUserV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import * as _accessGroupsUtils from '../../../utils/access-groups-utils';

import * as _tenantsService from '../../tenants';

const _identifyTenantParams = (
  user: IContextUserV1,
) => {
  let retVal;

  const LAST_SESSION_TENANT = user?.lastSession?.tenant;
  const LAST_SESSION_TENANT_ID = LAST_SESSION_TENANT?.id;
  const LAST_SESSION_TENANT_HASH = LAST_SESSION_TENANT?.hash;

  const ACCESS_GROUP = user?.session?.accessGroup;

  let tenantId;
  let tenantHash;

  if (
    !lodash.isEmpty(LAST_SESSION_TENANT_ID) &&
    _accessGroupsUtils.hasTenantId(ACCESS_GROUP, LAST_SESSION_TENANT_ID)
  ) {
    tenantId = LAST_SESSION_TENANT_ID;
    tenantHash = LAST_SESSION_TENANT_HASH;
  }

  if (
    lodash.isEmpty(LAST_SESSION_TENANT_ID)
  ) {
    const TMP_TENANTS: Array<IContextTenantV1> = user?.session?.accessGroup?.tenants;
    const TMP_TENANT: IContextTenantV1 = ramda.path([0], TMP_TENANTS);
    tenantId = TMP_TENANT?.id;
  }

  if (
    !lodash.isEmpty(tenantId)
  ) {
    retVal = {
      id: tenantId,
      hash: tenantHash,
    };

  }
  return retVal;
}

const _refreshTenantParamsIdAndHash = async (
  context: IContextV1,
  params: any,
) => {
  const TENANT = await _tenantsService.findOneById(context, params);
  if (
    !lodash.isEmpty(TENANT)
  ) {
    params.hash = TENANT.hash;
  } else {
    delete params?.id;
    delete params?.hash;
  }
}

export const assignSessionTenant = async (
  user: IContextUserV1,
  options: {
    isLogin: boolean,
  }
) => {
  try {
    const IS_LOGIN = options?.isLogin;
    const CONTEXT = { user };
    const PARAMS = _identifyTenantParams(user);
    let tenant;
    delete user.session.tenant;
    if (
      lodash.isEmpty(PARAMS) ||
      lodash.isEmpty(PARAMS.id)
    ) {
      return;
    }
    if (
      IS_LOGIN
    ) {
      await _refreshTenantParamsIdAndHash(CONTEXT, PARAMS);
      if (
        lodash.isEmpty(user?.lastSession)
      ) {
        user.lastSession = {};
      }
      if (
        lodash.isEmpty(user?.lastSession?.tenant)
      ) {
        user.lastSession.tenant = {};
      }
      user.lastSession.tenant.hash = PARAMS.hash;
    }
    if (
      lodash.isEmpty(PARAMS.id) ||
      lodash.isEmpty(PARAMS.hash)
    ) {
      return;
    }
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
    tenant = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash(PARAMS);
    if (
      lodash.isEmpty(tenant)
    ) {
      tenant = await TENANTS_CACHE_PROVIDER.tenants.reloadOneById({ id: PARAMS.id });
      user.lastSession.tenant = {
        id: tenant?.id,
        hash: tenant?.hash
      };
    }
    user.session.tenant = tenant;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(assignSessionTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
