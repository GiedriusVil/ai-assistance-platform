/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-jobs-queue-board-provider-express-app-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const express = require('express');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

let _app;

const ROUTER = new express.Router();

const setApp = (app) => {
    try {
        if (
            lodash.isEmpty(app)
        ) {
            const MESSAGE = `Missing required parameter app!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        if (
            !lodash.isEmpty(_app)
        ) {
            const MESSAGE = `Express application can be set only once - during library initialization!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        _app = app;
        _app.use('/', ROUTER);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('setApp', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const addRouter = (path, router) => {
    ROUTER.use(path, router);
}

module.exports = {
    setApp,
    addRouter,
}
