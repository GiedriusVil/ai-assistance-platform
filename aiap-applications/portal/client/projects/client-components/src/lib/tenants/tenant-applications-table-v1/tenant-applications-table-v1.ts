/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, } from '@angular/core';
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
  selector: 'aiap-tenant-applications-table-v1',
  templateUrl: './tenant-applications-table-v1.html',
  styleUrls: ['./tenant-applications-table-v1.scss'],
})
export class TenantApplicationsTableV1 extends BaseTable implements OnInit, OnChanges {

  static getClassName() {
    return 'TenantApplicationsTableV1';
  }

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any>;

  @Input('applications') applications: Array<any>;

  state: any = {
    queryType: DEFAULT_TABLE.TENANT_APPLICATIONS.TYPE,
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
      items: this.applications,
      total: this.applications.length
    }
    super.refreshTableModel();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: 'ID',
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: 'Name',
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: 'Enabled',
      field: 'enabled',
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
    RET_VAL.push(new TableItem({ data: item?.enabled }));
    RET_VAL.push(new TableItem({ data: item, template: this.actionsTemplate }));
    return RET_VAL;
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
