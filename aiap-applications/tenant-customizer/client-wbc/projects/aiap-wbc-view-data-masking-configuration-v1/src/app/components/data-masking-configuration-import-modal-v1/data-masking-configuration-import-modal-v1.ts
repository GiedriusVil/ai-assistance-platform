/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  _errorX,
  _debugX,
} from 'client-shared-utils';

import {
  DATA_MASKING_CONFIGURATIONS_MESSAGES,
} from 'client-utils';

import {
  DataMaskingConfigurationsServiceV1,
} from 'client-services';

import {
  BaseModalV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-data-masking-configuration-import-modal-v1',
  templateUrl: './data-masking-configuration-import-modal-v1.html',
  styleUrls: ['./data-masking-configuration-import-modal-v1.scss'],
})
export class MaskingConfigurationImportModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'MaskingConfigurationImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataMaskingConfigurationsService: DataMaskingConfigurationsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(MaskingConfigurationImportModalV1.getClassName(), 'import', { FILE });
    this.dataMaskingConfigurationsService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(MaskingConfigurationImportModalV1.getClassName(), 'import',
        {
          response,
        });

      this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(MaskingConfigurationImportModalV1.getClassName(), 'handleImportManyFromFile',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
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
