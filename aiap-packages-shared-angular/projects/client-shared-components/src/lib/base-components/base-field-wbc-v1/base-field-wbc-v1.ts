/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class BaseFieldWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'BaseFieldWbcV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  constructor() { }


  public superNgOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public abstract ngOnInit(): void;

  public abstract ngOnDestroy(): void;

}
