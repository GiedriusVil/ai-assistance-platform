/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import expressSecurity from './express-security';

const setupSecurity = (conf, app) => {
  expressSecurity(conf, app);
};

export {
  setupSecurity
};
