/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { createEngineInstance } = require('./create-one');
const { deleteEngineInstance } = require('./remove-one');
const { resetAllEngines } = require('./reset-all');
const { resetEngineInstanceByContext } = require('./reset-one');

module.exports = {
    createEngineInstance,
    deleteEngineInstance,
    resetAllEngines,
    resetEngineInstanceByContext
};
