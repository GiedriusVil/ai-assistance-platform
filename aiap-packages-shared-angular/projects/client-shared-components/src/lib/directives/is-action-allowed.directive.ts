/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

import * as lodash from 'lodash';

import {
  SessionServiceV1,
} from 'client-shared-services';

@Directive({
  selector: '[isActionAllowed]'
})
export class IsActionAllowedDirective {

  @Input()
  set isActionAllowed(value: any) {
    if (
      value?.enabled &&
      this._isAccessProvided(value)
    ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (
      !lodash.isBoolean(value?.enabled) &&
      this._isAccessProvided(value)
    ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sessionService: SessionServiceV1,
  ) { }

  _isAccessProvided(value: any) {
    let retVal = false;
    if (
      value &&
      value.action
    )
      retVal = this.sessionService.isActionAllowed(value);
    return retVal;
  }

}
