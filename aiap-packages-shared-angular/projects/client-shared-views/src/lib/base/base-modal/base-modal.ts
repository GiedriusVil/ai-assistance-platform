/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

/**
 * This is abstract class which has to be extended for each view which is going to be developed!
 */
export abstract class BaseModal {

  static getClassName() {
    return 'BaseModal';
  }

  public _destroyed$: Subject<void> = new Subject();

  public isLoading = false;
  public isOpen = false;

  public close() {
    this.enableBodyScroll();
    this.isOpen = false;
  }

  public superShow() {
    this.disableBodyScroll();
    this.isOpen = true;
  }

  public superNgOnInit(
    eventsService: EventsServiceV1,
  ) {
    eventsService.loadingEmitter.pipe(
      takeUntil(this._destroyed$),
    ).subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }

  public handleEventClose(event: any) {
    _debugX(BaseModal.getClassName(), 'handleEventClose',
      {
        event,
      });
    this.close();
  }

  public enableBodyScroll() {
    const BODY = document.body || document.getElementsByTagName('body')[0];
    BODY.classList.remove('bx--modal-shown');
  }

  public disableBodyScroll() {
    const BODY = document.body || document.getElementsByTagName('body')[0];
    BODY.classList.add('bx--modal-shown');
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
