/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { loadOneByIdAndTenant } = require('./load-one-by-id-and-tenant');

const { loadManyByTenant } = require('./load-many-by-tenant');

const { getOneByIdAndTenant } = require('./get-one-by-id-and-tenant');
const { getStorage, ensureQueuesStorage } = require('./get-storge');

const { deleteOneByIdAndTenant } = require('./delete-one-by-id-and-tenant');


module.exports = {
    loadManyByTenant,
    loadOneByIdAndTenant,
    ensureQueuesStorage,
    getOneByIdAndTenant,
    //
    //getOneByIdAndTenant,
    getStorage,
    //
    deleteOneByIdAndTenant,
}
