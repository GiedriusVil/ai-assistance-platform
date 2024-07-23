/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routesExport = express.Router();

const testCasesExportRoutes = require('./test-cases');

routesExport.use(
    '/', 
    testCasesExportRoutes
);

module.exports = {
    routesExport,
};
