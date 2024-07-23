/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { getTenantRegistry, getRegistry } = require('./get-tenant-registry');
const { loadOneByLambdaModule } = require('./load-one-by-lambda-module');
const { deleteOneById } = require('./delete-one-by-id');


module.exports = {
    getRegistry,
    getTenantRegistry,
    loadOneByLambdaModule,
    deleteOneById,
}
