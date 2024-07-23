/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { loadOneByIdAndTenant } = require('./load-one-by-id-and-tenant');
const { loadManyByTenant } = require('./load-many-by-tenant');

const { getOneByIdAndTenant } = require('./get-one-by-id-and-tenant');
const { getStorage } = require('./get-storage');

const { deleteOneByIdAndTenant } = require('./delete-one-by-id-and-tenant');
const { loadLambdaModuleAsMsTeamsCard } = require('./load-lambda-module-as-ms-teams-card');

module.exports = {
    loadManyByTenant,
    loadOneByIdAndTenant,
    //
    getOneByIdAndTenant,
    getStorage,
    //
    deleteOneByIdAndTenant,
    loadLambdaModuleAsMsTeamsCard,
}
