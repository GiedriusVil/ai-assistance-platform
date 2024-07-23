/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-app-demo-express-routes-utils-enagements`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getLibConfiguration } = require('../configuration');
const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');
const { getEngagementsDatasourceByTenant } = require('@ibm-aiap/aiap-engagements-datasource-provider');

const retrieveEngagementById = async (tenantId, engagementId) => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: tenantId });
    if (
      !lodash.isEmpty(TENANT)
    ) {
      const ENGAGEMENTS_DATASOURCE = getEngagementsDatasourceByTenant(TENANT);
      if (
        !lodash.isEmpty(ENGAGEMENTS_DATASOURCE)
      ) {
        const ENGAGEMENT = await ENGAGEMENTS_DATASOURCE.engagements.findOneById({}, {
          id: engagementId,
        });
        return ENGAGEMENT;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveEngagementById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveEngagementsByTenant = async (tenant) => {
  const RET_VAL = [];

  let items;
  try {
    const QUERY = {
      sort: {
        field: 'id',
        direction: 'asc',
      }
    };
    const DATASOURCE = getEngagementsDatasourceByTenant(tenant);
    if (
      !lodash.isEmpty(DATASOURCE)
    ) {
      const RESPONSE = await DATASOURCE.engagements.findManyByQuery({}, QUERY);
      items = RESPONSE?.items;
      if (
        !lodash.isEmpty(items) &&
        lodash.isArray(items)
      ) {
        for (let tmpItem of items) {
          if (
            tmpItem
          ) {
            tmpItem.tenant = tenant;
            RET_VAL.push(tmpItem);
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_retrieveEngagementsByTenant', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


const retrieveEngagements = async () => {
  const QUERY = {
    sort: {
      field: 'id',
      direction: 'asc'
    }
  };
  try {
    const DATASOURCE = getDatasourceV1App();
    const RESPONSE = await DATASOURCE.tenants.findManyByQuery({}, QUERY);
    const TENANTS = RESPONSE?.items;

    const PROMISES = [];
    if (
      !lodash.isEmpty(TENANTS) &&
      lodash.isArray(TENANTS)
    ) {
      const LIB_CONFIGURATION = getLibConfiguration();
      const LIB_CONFIGURATION_ENGAGEMENTS_FILTER = LIB_CONFIGURATION?.engagementsFilter;
      for (let tenant of TENANTS) {

        // [LEGO] -> SKIP TENANTS BY CONFIGURED ENVIRONMENTS
        const TENANT_ENVIRONMENT_ID = tenant?.environment?.id;
        const ENVIRONMENTS_TO_SKIP = LIB_CONFIGURATION_ENGAGEMENTS_FILTER?.skip?.environments;
        if (!lodash.includes(ENVIRONMENTS_TO_SKIP, TENANT_ENVIRONMENT_ID)) {
          PROMISES.push(_retrieveEngagementsByTenant(tenant));
        }
        // [LEGO] -> SKIP TENANTS BY CONFIGURED ENVIRONMENTS
      }
    }
    const PROMISES_RESPONSES = await Promise.all(PROMISES);
    const ENGAGEMENTS = [];
    if (
      !lodash.isEmpty(PROMISES_RESPONSES) &&
      lodash.isArray(PROMISES_RESPONSES)
    ) {
      for (let promiseResponse of PROMISES_RESPONSES) {

        if (
          !lodash.isEmpty(promiseResponse) &&
          lodash.isArray(promiseResponse)
        ) {
          ENGAGEMENTS.push(...promiseResponse);
        }
      }
    }

    const RET_VAL = ENGAGEMENTS.map((engagement) => {
      let tmpEngagement = {
        tenant: {
          id: engagement?.tenant?.id,
          environment: {
            id: engagement?.tenant?.environment?.id
          }
        },
        assistant: { id: engagement?.assistant?.id },
        id: engagement?.id
      }
      tmpEngagement.serialized = JSON.stringify(tmpEngagement);
      return tmpEngagement;
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('retrieveEngagements', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const retrieveEnvironmentsByEngagements = (engagements) => {
  try {
    const RET_VAL = [];
    if (!lodash.isEmpty(engagements)) {
      lodash.uniqBy(engagements, 'tenant.environment.id').map((engagement) => {
        RET_VAL.push(engagement?.tenant?.environment?.id);
      });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('retrieveEnvironmentsByEngagements', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  retrieveEngagements,
  retrieveEngagementById,
  retrieveEnvironmentsByEngagements,
};
