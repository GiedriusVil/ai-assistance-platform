/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-app-server-common-security`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import secure from 'express-secure-only';

export = (conf, app) => {
  if (!conf.expressSecurity) {
    logger.warn('[EXPRESS][SECURITY] Express security NOT enabled. Running unprotected server');
    return;
  }

  if (conf.expressSecurity.redirectToSSL) {
    logger.info('[EXPRESS][SECURITY] Running in cloud - setting up HTTPS redirect', { id: 1 });
    app.use(secure());
  }
};
