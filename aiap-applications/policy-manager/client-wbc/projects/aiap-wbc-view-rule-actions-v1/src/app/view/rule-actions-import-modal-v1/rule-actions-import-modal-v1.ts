/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  RULE_ACTIONS_MESSAGES_V1,
  RuleActionsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-actions-import-modal-v1',
  templateUrl: './rule-actions-import-modal-v1.html',
  styleUrls: ['./rule-actions-import-modal-v1.scss'],
})
export class RuleActionsImportModalV1 extends BaseModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled: boolean = true;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private ruleActionsService: RuleActionsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  async import() {
    const uploadedFile: File = ramda.path(['file'], this.files.values().next().value);
    this.eventsService.loadingEmit(true);
    this.ruleActionsService.importFromFile(uploadedFile).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportFromFileError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugW(RuleActionsImportModalV1.getClassName(), 'import', { response });

      const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
        .SUCCESS
        .IMPORT_FROM_FILE();

      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  show(): void {
    this.uploadButtonDisabled = true;
    this.isOpen = true;
  }

  private handleImportFromFileError(error: any) {
    _errorW(RuleActionsImportModalV1.getClassName(), 'handleImportFromFileError', { error });

    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
      .SUCCESS
      .IMPORT_FROM_FILE();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
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

  close() {
    this.isOpen = false;
    this.clearFileContainer();
  };
}
