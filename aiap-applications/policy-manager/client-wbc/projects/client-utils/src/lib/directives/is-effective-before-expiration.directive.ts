/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

@Directive({
  selector: '[appEffectiveBeforeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IsEffectiveBeforeExpirationDirective, multi: true }]
})
export class IsEffectiveBeforeExpirationDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    let effective = control.get('effective')?.value;
    let expires = control.get('expires')?.value;
    
    if (lodash.isArray(effective) && lodash.isArray(expires)) {
      effective = ramda.path([0], effective);
      expires = ramda.path([0], expires);
    }

    if (!lodash.isDate(effective) || !lodash.isDate(expires)) {
      return null;
    }

    const DIFF = expires.valueOf() - effective.valueOf(); 
    const IS_INVALID = DIFF < 0;

    return IS_INVALID ? { invalidDates: true} : null;
  }
}