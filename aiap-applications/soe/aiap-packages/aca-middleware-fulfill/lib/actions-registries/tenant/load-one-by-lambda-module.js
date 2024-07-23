/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-fulfill-actions-registry-load-one-by-lambda-module';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');

const { getTenantRegistry } = require('./get-tenant-registry');

const { wrapLambdaModuleActionTag } = require('./wrap-lamda-module-action-tag');

const loadOneByLambdaModule = (context, params) => {
  const TENANT_ID = ramda.path(['tenant', 'id'], context);

  const L_MODULE = ramda.path(['module'], params);
  const L_MODULE_COMPILED = ramda.path(['moduleCompiled'], params);

  const L_MODULE_ID = ramda.path(['id'], L_MODULE);
  try {
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required context.tenant.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(L_MODULE_ID)
    ) {
      const MESSAGE = `Missing required params.module.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(L_MODULE_COMPILED)
    ) {
      const MESSAGE = `Missing required params.moduleCompiled parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { L_MODULE_ID });
    }
    const REGISTRY = getTenantRegistry(TENANT_ID);
    if (L_MODULE_COMPILED.SimpleAction) {
      REGISTRY[L_MODULE_ID] = wrapLambdaModuleActionTag({
        module: L_MODULE,
        actionTag: L_MODULE_COMPILED.SimpleAction,
        configuration: L_MODULE_COMPILED.configuration,
      });
      logger.info(`Loaded lambda module as simple action tag!`, { L_MODULE_ID });
    } else if (L_MODULE_COMPILED.ComplexAction) {
      const CONTEXT = {
        sessionStore: getMemoryStore(),
      }
      REGISTRY[L_MODULE_ID] = wrapLambdaModuleActionTag({
        module: L_MODULE,
        actionTag: L_MODULE_COMPILED.ComplexAction(CONTEXT),
        configuration: L_MODULE_COMPILED.configuration,
      });
      logger.info(`Loaded lambda module as complex action tag!`, { L_MODULE_ID });
    } else if (
      !L_MODULE_COMPILED.SimpleAction &&
      !L_MODULE_COMPILED.ComplexAction
    ) {
      logger.warn(`Unable to process lambda module of type ACTION_TAG! Module type structure requirements not met - missing exported function SimpleAction or ComplexAction!`, { L_MODULE_ID });
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { TENANT_ID, L_MODULE_ID });
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  loadOneByLambdaModule,
}
