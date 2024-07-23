/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-josb-queue-board-provider-board`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


class AcaJobsQueueBoard {

    constructor(config) {
        this.config = config;
    }

}

module.exports = {
    AcaJobsQueueBoard,
}
