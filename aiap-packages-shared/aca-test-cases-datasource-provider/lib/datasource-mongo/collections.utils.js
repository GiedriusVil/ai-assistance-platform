/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    testWorkers: 'test_workers',
    testCases: 'test_cases',
    testExecutions: 'test_executions',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

    const TEST_WORKERS = ramda.path(['testWorkers'], COLLECTIONS_CONFIGURATION);
    const TEST_CASES = ramda.path(['testCases'], COLLECTIONS_CONFIGURATION);
    const TEST_EXECUTIONS = ramda.path(['testExecutions'], COLLECTIONS_CONFIGURATION);

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(TEST_WORKERS)
    ) {
        RET_VAL.testWorkers = TEST_WORKERS;
    }
    if (
        !lodash.isEmpty(TEST_CASES)
    ) {
        RET_VAL.testCases = TEST_CASES;
    }
    if (
        !lodash.isEmpty(TEST_EXECUTIONS)
    ) {
        RET_VAL.testExecutions = TEST_EXECUTIONS;
    }

    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
