/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const STORAGE = {};

const KEY_APP = 'app';

const setAppToStorage = (app) => {
  STORAGE[KEY_APP] = app;
}

const getAppFromStorage = () => {
  const RET_VAL = STORAGE[KEY_APP];
  return RET_VAL;
}

module.exports = {
  setAppToStorage,
  getAppFromStorage,
}
