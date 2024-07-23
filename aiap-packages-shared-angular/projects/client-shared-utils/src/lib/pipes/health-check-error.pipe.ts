/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

@Pipe({
  name: 'HealthCheckError',
})
export class HealthCheckErrorPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  transform(healthCheckItem: any): any {
    const HEALTH_CHECK_ERROR_MESSAGE = ramda.path(['message'], healthCheckItem);
    const BASE_PATH_ERROR = ramda.path(['basePathError'], healthCheckItem);
    if (!lodash.isEmpty(BASE_PATH_ERROR)) {
      return BASE_PATH_ERROR;
    }
    if (!lodash.isEmpty(HEALTH_CHECK_ERROR_MESSAGE)) {
      const REGEX_FOR_SYNTAX_ERRORS = /(?:^|\W)SyntaxError(?:$|\W)/;
      const TEST_FOR_SYNTAX_ERRORS = REGEX_FOR_SYNTAX_ERRORS.test(HEALTH_CHECK_ERROR_MESSAGE);
      if (TEST_FOR_SYNTAX_ERRORS) {
        return HEALTH_CHECK_ERROR_MESSAGE;
      } else {
        const REGEX_FOR_LIBS = /([^"\\]*(?:\*)*)'/;
        const RET_VAL = HEALTH_CHECK_ERROR_MESSAGE.match(REGEX_FOR_LIBS);
        if (RET_VAL) {
          return RET_VAL;
        } else {
          return HEALTH_CHECK_ERROR_MESSAGE
        }
      }
    } else {
      return '';
    }
  }
}