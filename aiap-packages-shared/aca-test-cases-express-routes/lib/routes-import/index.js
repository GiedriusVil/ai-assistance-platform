/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routesImport = express.Router();

const testCasesImportRoutes = require('./test-cases');

routesImport.use(
    '/',
    testCasesImportRoutes
);

module.exports = {
    routesImport,
};
