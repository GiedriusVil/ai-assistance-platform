/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs/internal/Subject';

export abstract class BaseViewV1 {

  static getClassName() {
    return 'BaseViewV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  public superNgOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
