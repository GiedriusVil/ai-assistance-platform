/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _errorW,
  _debugW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  VALIDATION_ENGAGEMENTS_MESSAGES_V1,
  ValidationEngagementsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-wbc-validation-engagements-import-modal-v1',
  templateUrl: './validation-engagements-import-modal-v1.html',
  styleUrls: ['./validation-engagements-import-modal-v1.scss'],
})
export class ValidationEngagementsImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ValidationEngagementsImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled: boolean = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private validationEngagementsService: ValidationEngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void { };

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void { };

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugW(ValidationEngagementsImportModalV1.getClassName(), 'import', { FILE });
    this.validationEngagementsService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFileError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugW(ValidationEngagementsImportModalV1.getClassName(), 'import', { response });
      this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.SUCCESS.IMPORT_MANY_FROM_FILE());
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFileError(error: any) {
    _debugW(ValidationEngagementsImportModalV1.getClassName(), 'handleImportManyFromFileError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(VALIDATION_ENGAGEMENTS_MESSAGES_V1.ERROR.IMPORT_MANY_FROM_FILE());
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }

}
