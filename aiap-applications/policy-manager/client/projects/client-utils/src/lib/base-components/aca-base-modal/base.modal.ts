/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';

/**
 * This is abstract class which has to be extended for each view which is going to be developed!
 */
export abstract class BaseModal {

  static getClassName() {
    return 'BaseModal';
  }

  public _destroyed$: Subject<void> = new Subject();

  public isLoading: boolean = false;
  public isOpen: boolean = false;

  public close() {
    this.isOpen = false;
  };

  public superShow() {
    this.isOpen = true;
  }

  public superNgOnInit(eventsService: any) {
    eventsService.loadingEmitter.pipe(
      takeUntil(this._destroyed$),
    ).subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }

  public superNgOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }


  public ensureNonEmptyValue(value: any, _default: any) {
    let retVal;
    if (
      lodash.isEmpty(value)
    ) {
      retVal = lodash.cloneDeep(_default);
    } else {
      retVal = lodash.cloneDeep(value);
    }
    return retVal;
  }
}
