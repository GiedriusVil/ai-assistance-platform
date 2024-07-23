/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { execHttpDeleteRequest } = require('./lib/exec-http-delete-request');
const { execHttpGetRequest } = require('./lib/exec-http-get-request');
const { execHttpPostRequest } = require('./lib/exec-http-post-request');
const { execHttpPutRequest } = require('./lib/exec-http-put-request');

module.exports = {
  execHttpDeleteRequest,
  execHttpGetRequest,
  execHttpPostRequest,
  execHttpPutRequest,
};
