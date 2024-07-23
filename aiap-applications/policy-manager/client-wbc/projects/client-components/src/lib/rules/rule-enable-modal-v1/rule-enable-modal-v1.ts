import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';


import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  RulesImportServiceV1,
  RulesServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-rule-enable-modal-v1',
  templateUrl: './rule-enable-modal-v1.html',
  styleUrls: ['./rule-enable-modal-v1.scss']
})
export class RuleEnableModalV1 extends BaseModal implements OnInit, OnDestroy {
  static getClassName() {
    return 'RuleEnableModalV1';
  }

  @Input() isRuleImport: boolean = false;

  _ids: any = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesService: RulesServiceV1,
    private rulesImportService: RulesImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleEnableSubmitClick() {
    _debugX(RuleEnableModalV1.getClassName(),'handleEnableSubmitClick', this.ids);

    let service;
    if (
      this.isRuleImport
    ) {
        _debugX(RuleEnableModalV1.getClassName(),'handleImportEnableSubmitClick', this.ids);
        service = this.rulesImportService.enableManyByIds(this.ids);
    } else {
      service = this.rulesService.enableManyByIds(this.ids);
    }

    service.pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleEnableSubmitError(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response) => {
        _debugX(RuleEnableModalV1.getClassName(), 'UpdateSubmitStatus', { response });
  
        const NOTIFICATION = {
          type: 'success',
          title: this.translateService.instant('rule_enable_modal_v1.notification.success_title'),
          target: '.notification-container',
          duration: 5000
        };
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleEnableSubmitError(error: any) {
    _errorX(RuleEnableModalV1.getClassName(), 'handleEnableSubmitError', { error });

    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_enable_modal_v1.notification.error_title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }



  show(ids: any[]) {
    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('rule_enable_modal_v1.notification.error.id_title'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }
}
