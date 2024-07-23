/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TableItem, TableHeaderItem } from 'client-shared-carbon';

import {
  SessionServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-tenant-db-clients-table-v1',
  templateUrl: './tenant-db-clients-table-v1.html',
  styleUrls: ['./tenant-db-clients-table-v1.scss'],
})
export class TenantDbClientsTableV1 extends BaseTable implements OnInit, OnChanges {

  static getClassName() {
    return 'TenantDbClientsTableV1';
  }

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any>;

  @Input() clients: Array<any>;
  @Output() clientsChange = new EventEmitter<Array<any>>();

  state: any = {
    queryType: DEFAULT_TABLE.TENANT_CLIENTS.TYPE,
  };

  constructor(
    protected timezoneService: TimezoneServiceV1,
    protected queryService: QueryServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    super(sessionService, queryService);
  }

  ngOnInit() {
    super.ngOnInit();
    super.setQueryType(this.state.queryType);
  }

  addFilterEventHandler() {
    //  
  }

  ngOnChanges() {
    super.ensureModelExistance();
    this.response = {
      items: this.clients,
      total: this.clients.length
    }
    super.refreshTableModel();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: "ID",
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Name",
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Type",
      field: 'type',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Database name",
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: 'Actions',
      sortable: false,
      visible: true,
      style: {
        width: '2%',
      }
    }));
    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item?.type }));
    RET_VAL.push(new TableItem({ data: item?.options?.name }));
    RET_VAL.push(new TableItem({ data: item, template: this.actionsTemplate }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

}
