/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const get = async (db, params) => {
  const CONFIG = params.config;

  const QUERY = {};

  const RESULT = db.collection(CONFIG.app.collections.surveys).find(QUERY).toArray();

  return RESULT;
};

module.exports = {
  get,
};
