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
  selector: '[isViewAllowed]'
})
export class IsViewAllowedDirective {

  @Input()
  set isViewAllowed(value: any) {
    let isAllowed = false;

    if (lodash.isArray(value)) {
      isAllowed = value.map(view => this.sessionService.isViewAllowed(view)).reduce((acc, isAllowed) => acc && isAllowed, true);
    } else {
      isAllowed = this.sessionService.isViewAllowed(value);
    }
    
    if (isAllowed) {
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

}
