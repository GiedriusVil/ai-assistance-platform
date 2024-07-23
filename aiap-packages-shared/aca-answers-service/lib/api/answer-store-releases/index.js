/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');

const { saveOne } = require('./save-one');
const { rollbackOne } = require('./rollback-one');

module.exports = {
    findManyByQuery,
    saveOne,
    rollbackOne,
}
