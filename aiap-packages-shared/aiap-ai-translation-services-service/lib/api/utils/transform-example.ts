/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-datasource-utils';

const lodash = require('@ibm-aca/aca-wrapper-lodash');


import {
  throwAcaError,
  ACA_ERROR_TYPE
} from "@ibm-aca/aca-utils-errors";


export const transformExample = (
  example: {
    source?: string,
    target?: string,
  }
): void => {
  
  if (lodash.isEmpty(example?.source) || !lodash.isString(example?.source)) {
    const MESSAGE = `Missing required example.source property or it's type is not String! example.source: ${example?.source}`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  if (lodash.isEmpty(example?.target) ||  !lodash.isString(example?.source)) {
    const MESSAGE = `Missing required example.target property or it's type is not String! example.target: ${example?.target}`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  example.source = example.source.toLowerCase();
  example.target = example.target.toLowerCase();
};
