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
  selector: 'aiap-tenant-tab-general-v1',
  templateUrl: './tenant-tab-general-v1.html',
  styleUrls: ['./tenant-tab-general-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class TenantTabGeneralV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'TenantTabGeneralV1';
  }

  @Input() tenant: any;
  @Output() tenantChange = new EventEmitter<any>();

  @Input() pullTenants: Array<any>;
  @Input() environments: Array<any>;

  assistiveTextPlacement: (
    [
      'top',
      'bottom',
      'left',
      'right',
    ]
  );
  assistiveTextAlignment: (
    [
      'center',
      'start',
      'end',
    ]
  );

  _selections: any = {
    environments: [],
    environment: undefined,
    pullTenants: [],
    pullTenant: undefined,
  };
  selections = lodash.cloneDeep(this._selections);

  constructor(
    private environmentService: EnvironmentServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private tenantsService: TenantsServiceV1,
  ) { }

  ngOnInit() {
    this.setSelections();
  }

  ngOnChanges() {
    this.setSelections();
  }

  ngOnDestroy() {
    //
  }

  private setSelections() {
    this.selections = lodash.cloneDeep(this._selections);
    this.setPullTenantSelections();
    this.setEnvironmentSelections();
  }

  handleEnvironmentSelectionEvent(event: any) {
    _debugX(TenantTabGeneralV1.getClassName(), 'handleEnvironmentSelectionEvent',
      {
        event,
        this_selections: this.selections
      });

    const NEW_TENANT = lodash.cloneDeep(this.tenant);
    NEW_TENANT.environment = {
      id: this.selections?.environment?.value
    };
    this.tenantChange.emit(NEW_TENANT);
  }


  handlePullTenantSelectionEvent(event: any) {
    _debugX(TenantTabGeneralV1.getClassName(), 'handlePullTenantSelectionEvent',
      {
        event,
        this_selections: this.selections
      });

    const NEW_TENANT = lodash.cloneDeep(this.tenant);
    NEW_TENANT.pullTenant = {
      id: this.selections?.pullTenant?.value
    };
    this.tenantChange.emit(NEW_TENANT);
  }

  handleApiKeyRefreshEvent(event: any) {
    _debugX(TenantTabGeneralV1.getClassName(), 'handleApiKeyRefreshEvent',
      {
        event,
      });

    this.tenantsService.retrieveApiKey()
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveApiKeyError(error)),
      ).subscribe((response: any) => {
        _debugX(TenantTabGeneralV1.getClassName(), 'handleApiKeyRefreshEvent',
          {
            response,
          });

        const NEW_TENANT = lodash.cloneDeep(this.tenant);
        NEW_TENANT.apiKey = response;
        this.tenantChange.emit(NEW_TENANT);
        this.eventsService.loadingEmit(false);
      });
  }

  private setPullTenantSelections() {
    this.selections.pullTenants = this.transformTenantsIntoDropDownItems(this.pullTenants);
    for (const PULL_TENANT of this.selections.pullTenants) {
      const PULL_TENANT_ID_SELECTED = this.tenant?.pullTenant?.id;
      if (
        PULL_TENANT_ID_SELECTED === PULL_TENANT?.value
      ) {
        PULL_TENANT.selected = true;
        this.selections.pullTenant = PULL_TENANT;
        break;
      }
    }
  }

  private transformTenantsIntoDropDownItems(tenants: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(tenants) &&
      !lodash.isEmpty(tenants)
    ) {
      for (const TENANT of tenants) {
        if (
          lodash.isString(TENANT?.name) &&
          !lodash.isEmpty(TENANT?.name) &&
          lodash.isString(TENANT?.id) &&
          !lodash.isEmpty(TENANT?.id) &&
          lodash.isString(TENANT?.environment?.id) &&
          !lodash.isEmpty(TENANT?.environment?.id)
        ) {
          const OPTION = {
            content: `[${TENANT.environment.id}] ${TENANT.name}`,
            value: TENANT.id
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private setEnvironmentSelections() {
    this.selections.environments = this.transformEnvironmentsIntoDropDownItems(this.environments);

    for (const ENVIRONMENT of this.selections.environments) {
      const ENVIRONMENT_SELECTED = this.tenant?.environment?.id
      if (
        ENVIRONMENT_SELECTED === ENVIRONMENT?.value
      ) {
        ENVIRONMENT.selected = true;
        this.selections.environment = ENVIRONMENT;
        break;
      }
    }
  }

  private transformEnvironmentsIntoDropDownItems(environments: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(environments) &&
      !lodash.isEmpty(environments)
    ) {
      for (const ENVIRONMENT of environments) {
        if (
          lodash.isString(ENVIRONMENT?.name) &&
          !lodash.isEmpty(ENVIRONMENT?.name) &&
          lodash.isString(ENVIRONMENT?.id) &&
          !lodash.isEmpty(ENVIRONMENT?.id)
        ) {
          const OPTION = {
            content: ENVIRONMENT.name,
            value: ENVIRONMENT.id
          }
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private handleRetrieveApiKeyError(error: any) {
    _errorX(TenantTabGeneralV1.getClassName(), 'handleRetrieveApiKeyError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = TENANTS_MESSAGES.SUCCESS.RETRIEVE_API_KEY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
