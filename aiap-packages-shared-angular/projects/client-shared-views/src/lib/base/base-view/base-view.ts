/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from "rxjs/internal/Subject";

export abstract class BaseView {

  static getClassName() {
    return 'BaseView';
  }

  public _destroyed$: Subject<void> = new Subject();

  public superNgOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
