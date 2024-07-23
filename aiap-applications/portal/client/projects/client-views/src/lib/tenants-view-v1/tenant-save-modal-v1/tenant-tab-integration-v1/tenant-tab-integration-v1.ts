/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  OnInit,
  OnDestroy,
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import { TranslateHelperServiceV1 } from 'client-shared-services';

import { NotificationService } from 'client-shared-carbon';

import {
  TENANTS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  TenantsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-tenant-tab-integration-v1',
  templateUrl: './tenant-tab-integration-v1.html',
  styleUrls: ['./tenant-tab-integration-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class TenantTabIntegrationV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'TenantTabIntegrationV1';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  uiState: any = {
    tokenRefresh: {
      secret: {
        label: this.translateService.instant('tenants_view_v1.save_modal_v1.integration_save_modal_v1.fld_name_token_refresh_secret.text')
      },
      expiryLengthMs: {
        label: this.translateService.instant('tenants_view_v1.save_modal_v1.integration_save_modal_v1.fld_name_token_Refresh_expiration_length.text'),
        helperText: ``,
        min: 0,
        size: `md`,
        step: 1,
      }
    },
    tokenAccess: {
      secret: {
        label: this.translateService.instant('tenants_view_v1.save_modal_v1.integration_save_modal_v1.fld_name_token_access_secret.text')
      },
      expiryLengthMs: {
        label: this.translateService.instant('tenants_view_v1.save_modal_v1.integration_save_modal_v1.fld_name_token_access_expiration_length.text'),
        helperText: ``,
        min: 0,
        size: `md`,
        step: 1,
      }
    }
  }

  constructor(
    private environmentService: EnvironmentServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private tenantsService: TenantsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() {
    //
  }

  ngOnChanges() {
    //
  }

  ngOnDestroy() {
    //
  }

  handleApiKeyRefreshEvent(event: any) {
    _debugX(TenantTabIntegrationV1.getClassName(), 'handleApiKeyRefreshEvent',
      {
        event,
      });

    this.tenantsService.retrieveApiKey()
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveApiKeyError(error)),
      ).subscribe(response => {
        _debugX(TenantTabIntegrationV1.getClassName(), 'handleApiKeyRefreshEvent',
          {
            response,
          });

        const NEW_VALUE = lodash.cloneDeep(this.value);
        NEW_VALUE.apiKey = response;
        this.valueChange.emit(NEW_VALUE);
        this.eventsService.loadingEmit(false);
      });
  }

  private handleRetrieveApiKeyError(error: any) {
    _errorX(TenantTabIntegrationV1.getClassName(), 'handleRetrieveApiKeyError',
      {
        error,
      });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = TENANTS_MESSAGES.SUCCESS.RETRIEVE_API_KEY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
