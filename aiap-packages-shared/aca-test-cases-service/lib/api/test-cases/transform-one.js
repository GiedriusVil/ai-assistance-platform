/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-test-cases-transform-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuid4 } = require('uuid');

const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaTestCasesDatasourceByTenant } = require('@ibm-aca/aca-test-cases-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');
const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const _transformOne = (context, params) => {
  throwAcaError(
    MODULE_ID,
    ACA_ERROR_TYPE.SYSTEM_ERROR,
    'Transform service is not implemented. Please implement it using lambda module.',
    { params }
  );
}

const getWorker = async (tenant) => {
  const WORKERS_DEFAULT_QUERY = {
    sort: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      page: 1,
      size: 1000,
    }
  };
  const TEST_CASES_DATASOURCE = getAcaTestCasesDatasourceByTenant(tenant);
  const WORKERS = await TEST_CASES_DATASOURCE.workers.findManyByQuery({}, WORKERS_DEFAULT_QUERY);
  if (lodash.isEmpty(WORKERS)) {
    const MESSAGE = `No workers was found!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const WORKER_ID = WORKERS?.items[0]?.id;
  return WORKER_ID;
}

const constructSaveOneParams = async (params, tenant) => {
  const TEST_CASE_NAME = params?.testCase?.name;
  const TEST_CASE_KEY = params?.testCase?.key;
  const TEST_CASE_ID = uuid4();
  const TEST_CASE_DESCRIPTION = params?.testCase?.description;
  const TEST_CASE_SCRIPT = params?.script;
  const WORKER_ID = await getWorker(tenant);
  const RET_VAL = {
    testCase: {
      id: TEST_CASE_ID,
      name: TEST_CASE_NAME,
      key: TEST_CASE_KEY,
      description: TEST_CASE_DESCRIPTION,
      worker: {
        id: WORKER_ID
      },
      script: {
        convos: TEST_CASE_SCRIPT
      }
    }
  };
  return RET_VAL;
}

const transformOne = async (context, params) => {
  try {
    const TRANSCRIPTS = params?.transcripts;
    const G_ACA_PROPS = params?.gAcaProps;
    const USERNAME = params?.username;
    if (lodash.isEmpty(TRANSCRIPTS)) {
      const MESSAGE = `Missing required params.transcripts attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(G_ACA_PROPS)) {
      const MESSAGE = `Missing required params.gAcaProps attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANTS_CASH_PROVIDER = getTenantsCacheProvider();
    const TENANT_ID = G_ACA_PROPS?.tenantId;
    const TENANT_RETRIEVE_PARAMS = {
      id: TENANT_ID
    };
    const TENANT = await TENANTS_CASH_PROVIDER.tenants.reloadOneById(TENANT_RETRIEVE_PARAMS);
    const CONTEXT = {
      user: {
        session: {
          tenant: TENANT
        },
        username: USERNAME
      }
    };
    await executeEnrichedByLambdaModule(MODULE_ID, _transformOne, CONTEXT, params);
    const PARAMS = await constructSaveOneParams(params, TENANT);
    const TEST_CASES_DATASOURCE = getAcaTestCasesDatasourceByTenant(TENANT);
    await TEST_CASES_DATASOURCE.cases.saveOne(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  transformOne,
}
