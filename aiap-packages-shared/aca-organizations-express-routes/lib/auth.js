/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-express-routes-auth';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const basicAuth = require('express-basic-auth');

const initAuthorizationByConfiguration = (config, app) => {
  try {
    if (
      lodash.isEmpty(config)
    ) {
      const MESSAGE = `Missing configuraiton provider parameter! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }

    const adminUsername = ramda.path(['app', 'users', 'admin', 'userName'], config);
    const adminPassword = ramda.path(['app', 'users', 'admin', 'userPass'], config);

    app.use(basicAuth({
      users: { [adminUsername]: adminPassword },
      unauthorizedResponse: 'User not authorised!'
    }));

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initAuthorizationByConfiguration', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  initAuthorizationByConfiguration
};
