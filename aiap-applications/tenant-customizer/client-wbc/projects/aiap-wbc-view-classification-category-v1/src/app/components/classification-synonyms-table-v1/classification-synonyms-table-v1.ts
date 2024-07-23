/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  TableModel,
  TableHeaderItem,
  TableItem
} from 'carbon-components-angular';
import {TranslateHelperServiceV1} from "client-shared-services";

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  selector: 'aiap-classification-synonyms-table-v1',
  templateUrl: './classification-synonyms-table-v1.html',
  styleUrls: ['./classification-synonyms-table-v1.scss'],
})
export class ClassificationSynonymsTableV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'ClassificationSynonymsTable';
  }

  @ViewChild('synonymRowTemplate', { static: true }) synonymRowTemplate: TemplateRef<any>;

  @Input() synonyms: Array<any>;
  @Output() synonymsChange = new EventEmitter<Array<any>>();

  model: TableModel;

  _state = {
    skeleton: false,
    search: '',
    synonyms: [],
    synonymsSelected: [],
  };
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private translateService: TranslateHelperServiceV1
  ) { }

  ngOnInit() {
    this.assignSynonymsToState(this.synonyms);
    this.ensureModelExistance();
    this.refreshModelData();
  }

  ngOnChanges() {
    this.assignSynonymsToState(this.synonyms);
    this.ensureModelExistance();
    this.refreshModelData();
  }

  ngOnDestroy() { }

  ngAfterViewInit() { }

  selectedSynonymsQty() {
    let retVal = 0;
    if (
      !lodash.isEmpty(this.synonyms)
    ) {
      for (let synonym of this.synonyms) {
        if (
          synonym.selected
        ) {
          retVal++;
        }
      }
    }
    return retVal;
  }

  private ensureModelExistance() {
    if (
      lodash.isEmpty(this.model)
    ) {
      this.model = new TableModel();
      this.constructTableHeader();
    }
  }

  private assignSynonymsToState(synonyms: Array<any>) {
    this.state = lodash.cloneDeep(this._state);
    if (
      lodash.isArray(synonyms) &&
      !lodash.isEmpty(synonyms)
    ) {
      synonyms.forEach((synonym: any, index: number) => {
        this.state.synonyms.push(synonym);
      });
    }
  }

  private constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('classification_synonyms_table_v1.col_id.header'),
      field: 'en'
    }));
    this.model.header = TABLE_HEADER;
  }

  private refreshModelData() {
    this.refreshStateSynonymsIndexes();
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms)
    ) {
      this.state.synonyms.forEach((synonym: any, index: number) => {
        let tableRow = this.__transformSynonymToRow(synonym);
        TABLE_ROWS.push(tableRow);
      });
    }
    this.model.data = TABLE_ROWS;
  }

  private refreshStateSynonymsIndexes() {
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms)
    ) {
      this.state.synonyms.forEach((synonym: any, index: number) => {
        synonym._index = index;
      });
    }
  }


  __transformSynonymToRow(synonym: any) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: synonym, template: this.synonymRowTemplate }));
    return RET_VAL;
  }

  handleSearchEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleSearchEvent', { event });
  }

  handleSearchClearEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleSearchClearEvent', { event });

  }

  handleRowRemoveManyEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowRemoveManyEvent', { event });
  }

  handleRowAddEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowAddEvent', {
      event: event,
      this_state: lodash.cloneDeep(this.state)
    });
    const SYNONYM_NEW = { en: null };
    const SYNONYMS_NEW = [SYNONYM_NEW];

    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms)
    ) {
      this.state.synonyms.forEach((synonym: any) => {
        SYNONYMS_NEW.push(synonym);
      });
    }
    this.assignSynonymsToState(SYNONYMS_NEW);
    this.refreshModelData();
    const EVENT = {
      type: 'SYNONYM_ADDED',
      data: this.state.synonyms,
    }
    this.synonymsChange.emit(this.state.synonyms);
  }

  handleRowSelectEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowSelectEvent', { event });
    const SELECTED_ROW_INDEX = ramda.path(['selectedRowIndex'], event);
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms) &&
      SELECTED_ROW_INDEX >= 0
    ) {
      const SELECTED_SYNONYM = this.state.synonyms[SELECTED_ROW_INDEX];
      SELECTED_SYNONYM.selected = true;
    }
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowSelectEvent', { this_state: this.state });
  }

  hadleRowSelectAllEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'hadleRowSelectAllEvent', { event });
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms)
    ) {
      this.state.synonyms.forEach((synonym: any) => {
        synonym.selected = true;
      });
    }
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'hadleRowSelectAllEvent', { this_state: this.state });
  }

  handleRowDeSelectEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowDeSelectEvent', { event });
    const SELECTED_ROW_INDEX = ramda.path(['deselectedRowIndex'], event);
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms) &&
      SELECTED_ROW_INDEX >= 0
    ) {
      const SELECTED_SYNONYM = this.state.synonyms[SELECTED_ROW_INDEX];
      SELECTED_SYNONYM.selected = false;
    }
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleRowDeSelectEvent', { this_state: this.state });
  }

  handleAllRowsDeselectEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleAllRowsDeselectEvent', { event });
    if (
      !lodash.isEmpty(this.state.synonyms) &&
      lodash.isArray(this.state.synonyms)
    ) {
      this.state.synonyms.forEach((synonym: any) => {
        synonym.selected = false;
      });
    }
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleAllRowsDeselectEvent', { this_state: this.state });
  }

  handleSortEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleSortEvent', { event });

  }

  handleSynonymChangeEvent(event) {
    _debugX(ClassificationSynonymsTableV1.getClassName(), 'handleSynonymChangeEvent', { event: event, this_state: this.state });
    this.synonymsChange.emit(this.state.synonyms);
  }


}
