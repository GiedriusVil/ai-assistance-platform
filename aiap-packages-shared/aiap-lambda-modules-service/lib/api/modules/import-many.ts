/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-modules-import-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { 
  formatIntoAcaError, 
  ACA_ERROR_TYPE, 
  throwAcaError 
} from '@ibm-aca/aca-utils-errors';

import { 
  lambdaModulesAuditorService 
} from '@ibm-aca/aca-auditor-service';

import { readJsonFromFile } from './import-utils';
import { saveOne } from './save-one';

const importMany = async (
  context: IContextV1, 
  params: {
    file: any
  }) => {
  try {
    const FILE = params?.file;
    const LAMBDA_MODULES_FROM_FILE = await readJsonFromFile(FILE);

    if (lodash.isEmpty(LAMBDA_MODULES_FROM_FILE)) {
      const MESSAGE = 'Missing lambda modules in file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const HAS_PROPER_FILE_STRUCTURE = LAMBDA_MODULES_FROM_FILE.every(
      module => lodash.has(module, 'id') && lodash.has(module, 'type')
    );

    if (!HAS_PROPER_FILE_STRUCTURE) {
      const MESSAGE = `Lambda modules are not compatible for import! File must contain 'id' and 'type' properties!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ALL_MODULES_ID_PRESENT = LAMBDA_MODULES_FROM_FILE.every(
      module => {
        const ID = module?.id;
        return !lodash.isEmpty(ID);
      }
    )
    if (!ALL_MODULES_ID_PRESENT) {
      const MESSAGE = `All lambda modules must contain 'id' values!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PROMISES = [];
    for (let module of LAMBDA_MODULES_FROM_FILE) {
      const LAMBDA_MODULE_PARAMS = {
        value: module,
      };
      logger.debug(importMany.name, LAMBDA_MODULE_PARAMS);
      PROMISES.push(saveOne(context, LAMBDA_MODULE_PARAMS));
    }
    const IMPORTED_MODULES = await Promise.all(PROMISES);
    _auditImport(context, IMPORTED_MODULES);
    const RET_VAL = {
      status: 'IMPORT SUCCESS'
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(importMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _auditImport = async (context: IContextV1, params) => {
  const AUDITOR_PARAMS = {
    action: 'IMPORT_MODULES',
    docId: 'n/a',
    docType: 'MODULE',
    doc: params,
    docChanges: {},
  };
  lambdaModulesAuditorService.saveOne(context, AUDITOR_PARAMS);
}

export {
  importMany,
}
