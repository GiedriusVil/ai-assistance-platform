/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'client-shared-carbon';

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

import { BaseModal } from 'client-shared-views';

import {
  TenantTabConfigurationV1,
} from './tenant-tab-configuration-v1/tenant-tab-configuration-v1';

@Component({
  selector: 'aiap-tenant-save-modal-v1',
  templateUrl: './tenant-save-modal-v1.html',
  styleUrls: ['./tenant-save-modal-v1.scss']
})
export class TenantSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TenantSaveModal';
  }

  @ViewChild('configurationTab', { static: true }) configurationTab: TenantTabConfigurationV1;

  _tenant: any = {
    id: undefined,
    name: undefined,
    external: {
      id: undefined,
    },
    environment: {
      id: undefined,
    },
    integration: {
      apiKey: undefined,
      tokenRefresh: {
        secret: undefined,
        expiryLengthMs: 1000 * 60 * 60 * 24,
      },
      tokenAccess: {
        secret: undefined,
        expiryLengthMs: 1000 * 60 * 5,
      }
    },
    pullTenant: {
      id: undefined
    },
    description: undefined,
    applications: [],
    redisClients: [],
    eventStreams: [],
    dbClients: [],
    _datasources: [],
    assistants: [],
    configuration: {},
    objectStorage: {},
  }
  _selections: any = {
    pullTenants: [],
    environments: []
  }

  selections = lodash.cloneDeep(this._selections);
  tenant = lodash.cloneDeep(this._tenant);


  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private environmentService: EnvironmentServiceV1,
    private tenantService: TenantsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  save() {
    const TENANT = this.getSanitizedTenant();
    _debugX(TenantSaveModalV1.getClassName(), 'save',
      {
        TENANT,
      });

    this.tenantService.save(TENANT)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveTenantError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TenantSaveModalV1.getClassName(), 'save',
          {
            response
          });

        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(undefined);
        this.close();
        this.notificationService.showNotification(TENANTS_MESSAGES.SUCCESS.SAVE_ONE);
      });
  }

  private getSanitizedTenant() {
    const RET_VAL = lodash.cloneDeep(this.tenant);
    const CONFIGURATION_TAB_VALUE = this.configurationTab.getValue();
    RET_VAL.configuration = CONFIGURATION_TAB_VALUE;
    return RET_VAL;
  }

  handleSaveTenantError(error: any) {
    _errorX(TenantSaveModalV1.getClassName(), 'handleSaveTenantError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TENANTS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  show(id: any) {
    this.loadValue(id);
  }

  loadValue(id: any) {
    _errorX(TenantSaveModalV1.getClassName(), 'loadValue',
      {
        id,
      });

    this.fetchFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleFindOneByIdError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _errorX(TenantSaveModalV1.getClassName(), 'loadValue',
          {
            response,
          });

        const SELECTIONS = lodash.cloneDeep(this._selections);

        this.tenant = ramda.mergeDeepRight(this._tenant, response?.tenant)

        if (
          lodash.isArray(response?.pullTenants?.items)
        ) {
          SELECTIONS.pullTenants = response.pullTenants.items;
        }
        if (
          lodash.isArray(response?.environments)
        ) {
          SELECTIONS.environments = response.environments;
        }
        this.selections = SELECTIONS;
        this.ensureApplicationsArray(this.tenant);
        this.ensureAssistantsArray(this.tenant);
        this.ensureDbClientsArray(this.tenant);
        this.ensureDatasourcesArray(this.tenant);
        this.ensureRedisClientsArray(this.tenant);
        this.ensureEventStreamsArray(this.tenant);
        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  private fetchFormData(tenantId: any) {
    const PULL_TENANTS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };

    const ENVIRONMENTS = this.environmentService.findManyByQuery();
    const PULL_TENANTS = this.tenantService.findManyByQuery(PULL_TENANTS_QUERY);
    const TENANT = lodash.isEmpty(tenantId) ? this.tenantService.getNewTenant() : this.tenantService.findOneById(tenantId);

    const FORK_SOURCES = {
      tenant: TENANT,
      environments: ENVIRONMENTS,
      pullTenants: PULL_TENANTS,
    };

    const RET_VAL = forkJoin(FORK_SOURCES);
    return RET_VAL;
  }

  private ensureApplicationsArray(tenant: any) {
    const APPLICATIONS = tenant?.applications;
    if (
      !lodash.isArray(APPLICATIONS)
    ) {
      tenant.applications = [];
    }
  }

  private ensureAssistantsArray(tenant: any) {
    const ASSISTANTS = tenant?.assistants;
    if (
      !lodash.isArray(ASSISTANTS)
    ) {
      tenant.assistants = [];
    }
  }

  private ensureDbClientsArray(tenant: any) {
    const DB_CLIENTS = tenant?.dbClients;
    if (
      !lodash.isArray(DB_CLIENTS)
    ) {
      tenant.dbClients = [];
    }
  }

  private ensureDatasourcesArray(tenant: any) {
    const DATASOURCES = tenant?._datasources;
    if (
      !lodash.isArray(DATASOURCES)
    ) {
      tenant._datasources = [];
    }
  }

  private ensureEventStreamsArray(tenant: any) {
    const EVENT_STREAMS = tenant?.eventStreams;
    if (
      !lodash.isArray(EVENT_STREAMS)
    ) {
      tenant.eventStreams = [];
    }
  }

  private ensureRedisClientsArray(tenant: any) {
    const REDIS_CLIENTS = tenant?.redisClients;
    if (
      !lodash.isArray(REDIS_CLIENTS)
    ) {
      tenant.redisClients = [];
    }
  }

  handleFindOneByIdError(error: any) {
    _errorX(TenantSaveModalV1.getClassName(), 'handleFindOneByIdError',
      {
        error,
      });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TENANTS_MESSAGES.ERROR.FETCH_TENANT_SELECTIONS);
    return of();
  }

  isInvalid() {
    const RET_VAL = !this.configurationTab.isValid();
    return RET_VAL;
  }

}
