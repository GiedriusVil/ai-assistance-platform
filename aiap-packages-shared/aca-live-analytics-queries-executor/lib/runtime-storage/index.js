/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { loadOneByRefAndTenant } = require('./load-one-by-ref-and-tenant');
const { loadManyByTenant } = require('./load-many-by-tenant');

const { getOneByRefAndTenant } = require('./get-one-by-ref-and-tenant');
const { getStorage } = require('./get-storage');

const { deleteOneByRefAndTenant } = require('./delete-one-by-ref-and-tenant');

module.exports = {
  loadManyByTenant,
  loadOneByRefAndTenant,
  //
  getOneByRefAndTenant,
  getStorage,
  //
  deleteOneByRefAndTenant,
}
