/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

import { of } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  TENANTS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
  ensureIdExistance,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  ConnectionsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-tenant-redis-clients-save-modal-v1',
  templateUrl: './tenant-redis-clients-save-modal-v1.html',
  styleUrls: ['./tenant-redis-clients-save-modal-v1.scss'],
})
export class TenantRedisClientsSaveModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantRedisClientsSaveModalV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Output() onAddRedisClient = new EventEmitter<any>();

  isOpen = false;

  _selections: any = {
    clientTypes: [
      {
        content: 'Redis',
        value: 'redis',
      },
      {
        content: 'IO Redis',
        value: 'ioredis'
      }
    ],
    clientType: undefined,
    tlsEnabled: false,
  }

  _tls: any = {
    strictSSL: false,
    pfx: {},
    cert: {
      ca: undefined,
    },
  }

  _client = {
    name: undefined,
    type: undefined,
    url: undefined,
    username: undefined,
    password: undefined,
    tls: lodash.cloneDeep(this._tls),
    sentinels: false,
    encryption: false,
    cluster: false,
  };

  client = lodash.cloneDeep(this._client);
  selections = lodash.cloneDeep(this._selections);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private connectionsService: ConnectionsServiceV1,
  ) { }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(client: any) {
    _debugX(TenantRedisClientsSaveModalV1.getClassName(), 'show',
      {
        client,
      });

    this.selections = lodash.cloneDeep(this._selections);
    const ID = client?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      this.client = lodash.cloneDeep(this._client);
    } else {
      this.client = lodash.cloneDeep(client);
    }
    this.ensureTlsStructure(this.client);
    this.setClientTypesSelections(this.client);
    const CLIENT_TLS_CERT_CA = this.client?.tls?.cert?.ca;
    if (
      !lodash.isEmpty(CLIENT_TLS_CERT_CA) &&
      lodash.isString(CLIENT_TLS_CERT_CA)
    ) {
      this.selections.tlsEnabled = true;
    }
    this.isOpen = true;
  }

  private ensureTlsStructure(client: any) {
    const TLS = client?.tls;
    if (
      lodash.isEmpty(TLS)
    ) {
      client.tls = lodash.cloneDeep(this._tls);
    }
  }

  private setClientTypesSelections(client: any) {
    const CLIENT_TYPE_SELECTED = client?.type;
    for (const CLIENT_TYPE of this.selections.clientTypes) {
      if (
        CLIENT_TYPE_SELECTED === CLIENT_TYPE?.value
      ) {
        CLIENT_TYPE.selected = true;
        this.selections.clientType = CLIENT_TYPE;
        break;
      }
    }
  }

  save() {
    const CLIENT = this.getSanitizedClient();
    ensureIdExistance(CLIENT);
    this.onAddRedisClient.emit(CLIENT);
    this.close();
  }

  private getSanitizedClient() {
    const RET_VAL = lodash.cloneDeep(this.client);
    const CLIENT_TYPE_SELECTED = this.selections?.clientType?.value;
    RET_VAL.type = CLIENT_TYPE_SELECTED;
    if (
      !this.selections?.tlsEnabled
    ) {
      delete RET_VAL.tls;
    }
    return RET_VAL;
  }

  close() {
    this.isOpen = false;
  }

  handleTlsFlagClickEvent(event: any) {
    _debugX(TenantRedisClientsSaveModalV1.getClassName(), 'handleTlsFlagClickEvent',
      {
        event,
      });

    this.selections.tlsEnabled = !this.selections.tlsEnabled;
  }

  isTlsEnabled() {
    const RET_VAL = this.selections.tlsEnabled;
    return RET_VAL;
  }

  handleTestConnectionClickEvent(event) {
    const CONFIGURATION = this.getSanitizedClient();
    _debugX(TenantRedisClientsSaveModalV1.getClassName(), `handleTestConnectionClickEvent`,
      {
        event,
        CONFIGURATION,
      });

    this.connectionsService.testRedisConnection(CONFIGURATION).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleTestConnectionError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TenantRedisClientsSaveModalV1.getClassName(), `handleTestConnectionClickEvent`,
        {
          response,
        });

      this.notificationService.showNotification(TENANTS_MESSAGES.SUCCESS.TEST_REDIS_CONNECTION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
    });
  }

  private handleTestConnectionError(error: any) {
    _errorX(TenantRedisClientsSaveModalV1.getClassName(), 'handleTestConnectionError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TENANTS_MESSAGES.ERROR.TEST_REDIS_CONNECTION);
    return of();
  }

}
