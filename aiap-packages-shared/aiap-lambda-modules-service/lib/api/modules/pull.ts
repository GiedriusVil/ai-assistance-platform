/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-pull';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import deepDifference from 'deep-diff';

import { getDatasourceByContext } from '../datasource.utils';
import { 
  formatIntoAcaError, 
  ACA_ERROR_TYPE, 
  throwAcaError 
} from '@ibm-aca/aca-utils-errors';

import { getDatasourceV1App } from '@ibm-aiap/aiap-app-datasource-provider';
import { lambdaModulesAuditorService } from '@ibm-aca/aca-auditor-service';

const _retrievePullSourceAccount = async (context: IContextV1) => {
  const SOURCE_ACCOUNT_ID = context?.user?.session?.account?.pullAccount?.id;
  if (
    lodash.isEmpty(SOURCE_ACCOUNT_ID)
  ) {
    const MESSAGE = `Missing required user.session.account.pullAccount.id attribute!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.BUSINESS_ERROR, MESSAGE);
  }
  const DATASOURCE = getDatasourceV1App();
  // field accounts doesn't exist
  // const RET_VAL = await DATASOURCE.accounts.findOneById(context, { id: SOURCE_ACCOUNT_ID });
  const RET_VAL = null;
  return RET_VAL;
}

const _retrievePullSourceLambdaModules = async (context: IContextV1) => {
  const PULL_ACCOUNT = await _retrievePullSourceAccount(context);
  if (
    lodash.isEmpty(PULL_ACCOUNT)
  ) {
    const MESSAGE = `Unable retrieve PULL_ACCOUNT`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.BUSINESS_ERROR, MESSAGE);
  }
  const OVERRIDDEN_SESSION = lodash.cloneDeep(context);
  OVERRIDDEN_SESSION.user.session.account = PULL_ACCOUNT;
  const DATASOURCE = getDatasourceByContext(OVERRIDDEN_SESSION);

  const PARAMS = {
    pagination: {
      page: 1,
      size: 99999
    },
    sort: { field: 'id', direction: 'desc' }
  };
  const RESPONSE = await DATASOURCE.modules.findManyByQuery(OVERRIDDEN_SESSION, PARAMS);
  const RET_VAL = RESPONSE?.items;
  return RET_VAL;
}

const _retrieveCurrentLambdaModules = async (context: IContextV1) => {
  const DATASOURCE = getDatasourceByContext(context);
  const PARAMS: any = {
    pagination: {
      page: 1,
      size: 99999
    }
  };
  const RESPONSE = await DATASOURCE.modules.findManyByQuery(context, PARAMS);
  const RET_VAL = RESPONSE?.items;
  return RET_VAL;
}

const _deployLambdaModule = async (context: IContextV1, params) => {
  const lambdaModule = params?.module;
  let retVal;
  if (
    !lodash.isEmpty(lambdaModule)
  ) {
    const DATASOURCE = getDatasourceByContext(context);
    const ID = params?.module?.id;
    const AUDITOR_PARAMS = {
      action: 'SAVE_ONE_BY_PULL',
      docId: ID,
      docType: 'LAMBDA_MODULES',
      doc: lambdaModule,
    };
    lambdaModulesAuditorService.saveOne(context, AUDITOR_PARAMS);
    retVal = await DATASOURCE.modules.saveOne(context, { value: lambdaModule });
  }
  return retVal;
}

const _deployLambdaModules = async (context: IContextV1, params) => {
  const LAMBDA_MODULES = params?.lambdaModules;
  const PROMISES = [];
  if (
    !lodash.isEmpty(LAMBDA_MODULES) &&
    lodash.isArray(LAMBDA_MODULES)
  ) {
    for (let lambdaModule of LAMBDA_MODULES) {
      PROMISES.push(_deployLambdaModule(context, { module: lambdaModule }));
    }
  }
  const RET_VAL = Promise.all(PROMISES);
  return RET_VAL;
}

const pull = async (context: IContextV1, params) => {
  try {
    const LAMBDA_MODULES_SOURCE = await _retrievePullSourceLambdaModules(context);
    const LAMBDA_MODULES_CURRENT = await _retrieveCurrentLambdaModules(context);
    const LAMBDA_MODULES_CHANGES = deepDifference(
      { lambdaModule: LAMBDA_MODULES_CURRENT }, 
      { lambdaModules: LAMBDA_MODULES_SOURCE }
    );

    const DATE = new Date();
    const LAMBDA_MODULES_PULL_RELEASE = {
      created: DATE,
      createdT: DATE.getTime(),
      deployed: DATE,
      deployedT: DATE.getTime(),
      _as_is: LAMBDA_MODULES_CURRENT,
      _to_be: LAMBDA_MODULES_SOURCE,
      _changes: LAMBDA_MODULES_CHANGES,
    };
    await _deployLambdaModules(context, { lambdaModules: LAMBDA_MODULES_SOURCE });
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.modulesReleases.saveOne(context, { value: LAMBDA_MODULES_PULL_RELEASE });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(pull.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  pull,
}
