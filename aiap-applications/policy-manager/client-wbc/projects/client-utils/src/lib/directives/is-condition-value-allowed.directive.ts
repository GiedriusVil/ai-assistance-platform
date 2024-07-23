/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import * as lodash from 'lodash';

import { isAnArray, ARRAY_OPERATORS } from '../utils';
@Directive({
  selector: '[appConditionValueAllowedValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IsConditionValueAllowedDirective, multi: true }]
})
export class IsConditionValueAllowedDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    let errors: any = {};
    let operator = control.get('operator')?.value?.value?.type;
    if (lodash.isEmpty(operator)) {
      operator = control.get('operator')?.value?.content;
    }
    const VALUE = control.get('value')?.value;

    if (lodash.isEmpty(VALUE)) {
      return null;
    }
    if (
      lodash.isString(operator) &&
      ARRAY_OPERATORS.includes(operator)
    ) {
      if (!isAnArray(VALUE)) {
        errors.notAnArray = true;
      }
    }
    return lodash.isEmpty(errors) ? null : errors;
  }
}
