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
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

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
  selector: 'aiap-tenant-db-clients-save-modal-v1',
  templateUrl: './tenant-db-clients-save-modal-v1.html',
  styleUrls: ['./tenant-db-clients-save-modal-v1.scss'],
})
export class TenantDbClientsSaveModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantDbClientsSaveModalV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Output() onAddDbClient = new EventEmitter<any>();

  isOpen = false;

  _selections: any = {
    dbTypes: [
      {
        content: 'Mongo',
        value: 'mongo',
      },
      {
        content: 'Postgres(Disabled)',
        value: 'posgres'
      },
    ],
    dbType: undefined,
    tlsEnabled: false,
  };

  _client = {
    name: undefined,
    type: undefined,
    options: {
      uri: undefined,
      name: undefined,
      sslValidate: undefined,
      ssl: {
        cert: undefined,
      }
    }
  };

  selections = lodash.cloneDeep(this._selections);
  client = lodash.cloneDeep(this._client);

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
    _debugX(TenantDbClientsSaveModalV1.getClassName(), 'show',
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
    ///
    this.setDbTypesSelections(this.client);
    const CLIENT_OPTIONS_SSL_CERT = this.client?.options?.ssl?.cert;
    if (
      !lodash.isEmpty(CLIENT_OPTIONS_SSL_CERT) &&
      lodash.isString(CLIENT_OPTIONS_SSL_CERT)
    ) {
      this.selections.tlsEnabled = true;
    }
    this.isOpen = true;
  }

  private setDbTypesSelections(client: any) {
    const DB_TYPE_SELECTED = client?.type;
    for (const DB_TYPE of this.selections.dbTypes) {
      if (
        DB_TYPE_SELECTED === DB_TYPE?.value
      ) {
        DB_TYPE.selected = true;
        this.selections.dbType = DB_TYPE;
        break;
      }
    }
  }

  save() {
    const CLIENT = this.getSanitizedClient();
    ensureIdExistance(CLIENT);
    this.onAddDbClient.emit(CLIENT);
    this.close();
  }

  handleTestConnectionClickEvent(event: any) {
    const CONFIGURATION = this.getSanitizedClient();
    _debugX(TenantDbClientsSaveModalV1.getClassName(), `handleTestConnectionClickEvent`,
      {
        event,
        CONFIGURATION,
      });

    this.connectionsService.testMongoConnection(CONFIGURATION).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleTestConnectionError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TenantDbClientsSaveModalV1.getClassName(), `handleTestConnectionClickEvent`,
        {
          response,
        });

      this.notificationService.showNotification(TENANTS_MESSAGES.SUCCESS.TEST_MONGO_CONNECTION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
    });
  }

  private handleTestConnectionError(error: any) {
    _errorX(TenantDbClientsSaveModalV1.getClassName(), 'handleTestConnectionError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TENANTS_MESSAGES.ERROR.TEST_MONGO_CONNECTION);
    return of();
  }

  private getSanitizedClient() {
    const RET_VAL = lodash.cloneDeep(this.client);
    const DB_TYPE_SELECTED = this.selections?.dbType?.value;
    RET_VAL.type = DB_TYPE_SELECTED
    const isTlsEnabled = this.isTlsEnabled();
    if (!isTlsEnabled) {
      RET_VAL.options.sslValidate = false;
    }
    return RET_VAL;
  }

  close() {
    this.isOpen = false;
  }

  handleTlsFlagClickEvent(event: any) {
    _debugX(TenantDbClientsSaveModalV1.getClassName(), 'handleTlsFlagClickEvent',
      {
        event,
      });

    this.selections.tlsEnabled = !this.selections.tlsEnabled;
  }

  isTlsEnabled() {
    const RET_VAL = this.selections.tlsEnabled;
    return RET_VAL;
  }

}
