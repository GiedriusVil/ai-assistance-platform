/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subject } from "rxjs/internal/Subject";

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  template: ''
})
export abstract class BaseTabV1 implements OnDestroy {

  static getClassName() {
    return 'BaseTabV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  @Input() context: any = { wbc: undefined, }
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any = {};
  @Output() valueChange = new EventEmitter<any>();

  constructor() { }

  ngOnDestroy(): void {
    _debugX(BaseTabV1.getClassName(), 'ngOnInit',
      {
        this_context: this.context,
        this_value: this.value,
      });
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
