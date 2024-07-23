/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  replaceByIdOrAddAsNew,
} from 'client-shared-utils';

import {
  TenantDbClientsSaveModalV1,
} from './tenant-db-clients-save-modal-v1/tenant-db-clients-save-modal-v1';

import {
  TenantDatasourcesSaveModalV1,
} from './tenant-datasources-save-modal-v1/tenant-datasources-save-modal-v1';


@Component({
  selector: 'aiap-tenant-tab-datasources-v1',
  templateUrl: './tenant-tab-datasources-v1.html',
  styleUrls: ['./tenant-tab-datasources-v1.scss'],
})
export class TenantTabDatasourcesV1 {

  static getClassName() {
    return 'TenantTabDatasourcesV1';
  }

  @ViewChild('dbClientsSaveModal') dbClientSaveModal: TenantDbClientsSaveModalV1;
  @ViewChild('datasourcesSaveModal') datasourceSaveModal: TenantDatasourcesSaveModalV1;

  @Input() dbClients: Array<any>;
  @Output() dbClientsChange = new EventEmitter<any[]>();

  @Input() datasources: Array<any>;
  @Output() datasourcesChange = new EventEmitter<any[]>();

  handleDbClientAddEvent(dbClient: any) {
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDbClientAddEvent',
      {
        dbClient,
      });

    const NEW_DB_CLIENTS = lodash.cloneDeep(this.dbClients);
    replaceByIdOrAddAsNew(NEW_DB_CLIENTS, dbClient);
    this.dbClientsChange.emit(NEW_DB_CLIENTS);
  }

  handleDatasourceAddEvent(datasource: any) {
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDatasourceAddEvent',
      {
        datasource,
      });

    const NEW_DATASOURCES = lodash.cloneDeep(this.datasources);
    replaceByIdOrAddAsNew(NEW_DATASOURCES, datasource);
    this.datasourcesChange.emit(NEW_DATASOURCES);
  }

  handleDbClientSavePlaceShowEvent(event: any) {
    const CLIENT = event?.value;
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDbClientShowSavePlaceEvent',
      {
        CLIENT,
      });

    this.dbClientSaveModal.show(CLIENT);
  }

  handleDatasourceSavePlaceShowEvent(event: any) {
    const DATASOURCE = event;
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDatasourceSavePlaceShowEvent',
      {
        DATASOURCE,
      });

    this.datasourceSaveModal.show(DATASOURCE, this.dbClients);
  }

  handleDbClientDeleteEvent(event: any) {
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDbClientDeleteEvent',
      {
        event,
      });

    const ITEM_TO_REMOVE = event;
    const NEW_CLIENTS = lodash.cloneDeep(this.dbClients);
    lodash.remove(NEW_CLIENTS, { id: ITEM_TO_REMOVE?.id });
    this.dbClientsChange.emit(NEW_CLIENTS);
  }

  handleDatasourceDeleteEvent(event: any) {
    _debugX(TenantTabDatasourcesV1.getClassName(), 'handleDatasourceDeleteEvent',
      {
        event,
      });

    const ITEMS_TO_REMOVE = event?.ids;
    const NEW_DATASOURCES = lodash.cloneDeep(this.datasources);
    ITEMS_TO_REMOVE.forEach(datasourceId => {
      lodash.remove(NEW_DATASOURCES, { id: datasourceId });
    });
    this.datasourcesChange.emit(NEW_DATASOURCES);
  }
}
