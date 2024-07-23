/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-worker-provider-woker';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ACA_TEST_WORKER_STATUS = {
    READY: 'READY',
    BUSY: 'BUSY',
    RESETING: 'RESETING',
    DESTROYED: 'DESTROYED',
    INVALID: 'INVALID',
}

const DEFAULT_CRON_SCHEDULE = '*/10 * * * * *';

class AcaTestWorker {

    constructor(definition) {
        this.resetDefinition(definition);
        const SLOT = ramda.path(['slot'], definition);
        if (
            !lodash.isNumber(SLOT)
        ) {
            const MESSAGE = `Missing definition.slot parameter! Must be number!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, { definition });
        }
        this.slot = SLOT;
    }

    resetDefinition(definition) {
        const ID = ramda.path(['id'], definition);
        const NAME = ramda.path(['name'], definition);
        const TENANT_ID = ramda.path(['tenantId'], definition);
        const CONFIGURATION = ramda.path(['configuration'], definition);
        const CRON_EXPRESSION = ramda.path(['cronExpression'], definition);
        if (
            lodash.isEmpty(ID)
        ) {
            const MESSAGE = `Missing definition.id parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, { definition });
        }
        if (
            lodash.isEmpty(NAME)
        ) {
            const MESSAGE = `Missing definition.name parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, { definition });
        }
        if (
            lodash.isEmpty(TENANT_ID)
        ) {
            const MESSAGE = `Missing definition.tenantId parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, { definition });
        }
        if (
            lodash.isEmpty(CONFIGURATION)
        ) {
            const MESSAGE = `Missing definition.configuration parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, { definition });
        }
        this.id = ID;
        this.name = NAME;
        this.tenantId = TENANT_ID;
        this.state = ACA_TEST_WORKER_STATUS.READY;
        this.configuration = CONFIGURATION;
        if (
            lodash.isEmpty(CRON_EXPRESSION)
        ) {
            this.cronExpression = DEFAULT_CRON_SCHEDULE;
        } else {
            this.cronExpression = CRON_EXPRESSION;
        }
    }

    async initialize() {
        const MESSAGE = 'Missing implementation!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE, {
            this_id: this.id,
            this_name: this.name,
            this_configuration: this.configuration,
        });
    }

}

module.exports = {
    AcaTestWorker,
    ACA_TEST_WORKER_STATUS,
}
