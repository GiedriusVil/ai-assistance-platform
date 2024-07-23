/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-synchronize-with-database-applications';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

const synchroniseWithDatabaseApplication = async (
  context: IContextV1,
  params: {
    applicationConfigAbsolutePath: any,
  },
) => {
  let retVal;
  let application;
  try {
    if (
      lodash.isEmpty(params?.applicationConfigAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.applicationConfigAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    application = fsExtra.readJSONSync(params?.applicationConfigAbsolutePath);
    if (
      lodash.isEmpty(application?.id)
    ) {
      const ERROR_MESSAGE = `Missing required attribute application?.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const DATASOURCE = getDatasourceV1App();
    retVal = await DATASOURCE.applications.saveOne(context, { value: application });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(synchroniseWithDatabaseApplication.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  return retVal;
}

export const synchronizeWithDatabaseApplications = async (
  context: IContextV1,
  params: {
    configAbsolutePath: any,
  },
) => {
  let configAbsolutePathApplications;
  let directory;
  const RET_VAL: Array<any> = [];
  try {
    if (
      lodash.isEmpty(params?.configAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configAbsolutePathApplications = `${params?.configAbsolutePath}/runtime-data-local/portal/applications`;
    fsExtra.ensureDirSync(configAbsolutePathApplications);
    directory = fsExtra.readdirSync(configAbsolutePathApplications);
    if (
      !lodash.isEmpty(directory) &&
      lodash.isArray(directory)
    ) {
      const PROMISES = [];
      for (const APPLICATION_CONFIG_FILE of directory) {
        if (
          !lodash.isEmpty(APPLICATION_CONFIG_FILE) &&
          APPLICATION_CONFIG_FILE.endsWith('.json')
        ) {
          PROMISES.push(synchroniseWithDatabaseApplication(context, {
            applicationConfigAbsolutePath: `${configAbsolutePathApplications}/${APPLICATION_CONFIG_FILE}`
          }));
        }
      }
      const APPLICATIONS = await Promise.all(PROMISES);
      if (
        !lodash.isEmpty(APPLICATIONS) &&
        lodash.isArray(APPLICATIONS)
      ) {
        for (const APPLICATION of APPLICATIONS) {
          if (
            !lodash.isEmpty(APPLICATION?.id)
          ) {
            RET_VAL.push(APPLICATION?.id);
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseApplications.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
