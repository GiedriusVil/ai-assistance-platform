/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, } from "@angular/core";

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { TableHeaderItem, TableItem } from "carbon-components-angular";

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  UtilsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-differences-table-v1',
  templateUrl: './differences-table-v1.html',
  styleUrls: ['./differences-table-v1.scss'],
})
export class DifferencesTableV1 extends BaseTableV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'DifferencesTableV1';
  }

  @Input() transaction: any;

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private utilsService: UtilsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getItemChanges(this.transaction);
    setTimeout(() => {
      this.refreshTableModel();
    }, 100);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('difference_table_v1.table.field_header'),
      field: 'fieldName'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('difference_table_v1.table.old_value_header'),
      field: 'oldValue'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('difference_table_v1.table.new_value_header'),
      field: 'newValue'
    }));
    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    if (item?.fieldName === 'Due Date') {
      item.oldValue = this.utilsService.transformDateString(item.oldValue, false);
      item.newValue = this.utilsService.transformDateString(item.newValue, false);
    }
    RET_VAL.push(new TableItem({ data: item?.fieldName }));
    RET_VAL.push(new TableItem({ data: item?.oldValue }));
    RET_VAL.push(new TableItem({ data: item?.newValue }));
    return RET_VAL;
  }

  getItemChanges(item: any) {
    const CHANGES = [];
    const DOC_CHANGES = ramda.path(['docChanges'], item);
    if (!lodash.isEmpty(DOC_CHANGES) && lodash.isArray(DOC_CHANGES)) {
      DOC_CHANGES.forEach(docChange => {
        if (docChange.kind == 'E') {
          this.handleItemChange(docChange, CHANGES);
        } else if (docChange.kind == 'A') {
          this.handleArrayChange(docChange, CHANGES);
        }
      });
    }
    this.response = {
      items: CHANGES,
      total: CHANGES.length
    }
  }

  handleItemChange(changeIn, changesOut) {
    const CHANGE_PATH = ramda.path(['path'], changeIn);
    if (this.filterPathArray(CHANGE_PATH)) {
      changesOut.push({
        fieldName: this.pathArrayToString(CHANGE_PATH),
        oldValue: changeIn.lhs,
        newValue: changeIn.rhs
      });
    }
  }

  filterPathArray(pathArray) {
    return pathArray[pathArray.length - 1] != 'content';
  }

  pathArrayToString(pathArray) {
    return pathArray.map(pathItem => {
      if (isNaN(pathItem)) {
        return pathItem;
      } else {
        return parseInt(pathItem) + 1;
      }
    }).join('\\');
  }

  handleArrayChange(changeIn, changesOut) {
    const CHANGE_ITEM = changeIn?.item;
    const CHANGE_KIND = CHANGE_ITEM?.kind;

    if (CHANGE_KIND == 'N') {
      this.handleNewArrayElement(changeIn, changesOut);
    }

    if (CHANGE_KIND == 'D') {
      this.handleRemovedArrayElement(changeIn, changesOut);
    }
  }

  handleNewArrayElement(changeIn, changesOut) {
    const RHS: any = ramda.pathOr([], ['item', 'rhs'], changeIn);

    for (let newValue in RHS) {
      changesOut.push({
        fieldName: `${changeIn.path.toString()}\\${RHS.index}\\${newValue}`,
        oldValue: '-',
        newValue: RHS[newValue]
      });
    }
  }

  handleRemovedArrayElement(changeIn, changesOut) {
    const LHS: any = ramda.pathOr([], ['item', 'lhs'], changeIn);

    for (let newValue in LHS) {
      changesOut.push({
        fieldName: `${changeIn.path.toString()}\\${LHS.index}\\${newValue}`,
        oldValue: LHS[newValue],
        newValue: '-'
      });
    }
  }

  convertCamelCaseToSentenceCase(text: string) {
    const RESULT = text.replace(/([A-Z])/g, " $1");
    const RET_VAL = RESULT.charAt(0).toUpperCase() + RESULT.slice(1);
    return RET_VAL;
  }

  addFilterEventHandler() { }

  isShowRowSavePlaceAllowed() {
    return true;
  }
}
