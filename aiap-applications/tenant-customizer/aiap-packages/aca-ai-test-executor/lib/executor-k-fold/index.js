/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-test-executor-k-fold';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { AcaAiTestExecutor } = require('../executor');

const _actions = require('./actions');

class AcaAiTestExecutorKFold extends AcaAiTestExecutor {

    constructor() {
        super();
    }

    get tests() {
        const RET_VAL = {
            executeOne: (context, params) => {
                return _actions.executeOne(context, params);
            },
        };
        return RET_VAL;
    }
}

module.exports = {
    AcaAiTestExecutorKFold
};
