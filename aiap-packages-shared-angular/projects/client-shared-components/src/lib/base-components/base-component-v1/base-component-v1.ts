/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

/**
 * This is abstract class which has to be extended for each view which is going to be developed!
 */
export abstract class BaseComponentV1 {

  static getClassName() {
    return 'BaseComponentV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  public isLoading = false;

  public superNgOnInit(eventsService: any = undefined) {
    if (
      eventsService
    ) {
      eventsService.loadingEmitter.pipe(
        takeUntil(this._destroyed$),
      ).subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
    }
  }

  public superNgOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
