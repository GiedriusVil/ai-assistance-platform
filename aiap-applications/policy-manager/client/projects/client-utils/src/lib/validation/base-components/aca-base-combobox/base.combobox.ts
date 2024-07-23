/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import * as lodash from 'lodash';

import { _debugX } from 'client-shared-utils';
import { ComboBox } from 'carbon-components-angular';

@Component({
  template: ''
})
export abstract class BaseCombobox implements OnInit, OnDestroy {

  static getClassName() {
    return 'BaseCombobox';
  }

  public queryState: any;
  public _queryState: any;

  public _state = {
    itemsRaw: [],
    items: [],
    selected: undefined,
  };
  public state: any = lodash.cloneDeep(this._state);

  @Input() public value;
  @Output() public valueChange = new EventEmitter<Array<any>>();

  public combobox: ComboBox;

  public debouncedSearch(value: any) { }

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    @Inject('QueryService') protected queryService: any,
  ) { }


  public handleSelectedEvent(items: any) {
    _debugX(BaseCombobox.getClassName(), 'handleSelectedEvent', { items });
  }

  public handleCloseEvent(event: any) {
    _debugX(BaseCombobox.getClassName(), 'handleCloseEvent', { event, this_state: this.state });
    this.valueChange.emit(this.state?.selected?.value);
  }

  public handleSubmitEvent(event: any) {
    _debugX(BaseCombobox.getClassName(), 'handleSubmitEvent', { event });
  }


  public handleScrollEvent(event: any) {
    const AT_BOTTOM = event?.atBottom;
    if (!this.shouldHandleScrollEvent(AT_BOTTOM)) {
      return;
    }

    _debugX(BaseCombobox.getClassName(), 'handleScrollEvent', { event });
    this.queryState.page += 1;
    this.loadItems();
  }

  public ngOnInit(): void {
    _debugX(BaseCombobox.getClassName(), 'ngOnInit')
    this.debouncedSearch = lodash.debounce(this.search, 1000);
  }

  public ngOnDestroy(): void {
    _debugX(BaseCombobox.getClassName(), 'ngOnDestroy');
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public handleSearchEvent(event: any) {
    this.resetStates();
    this.debouncedSearch(event);
  }
  public search(value: any) {
    _debugX(BaseCombobox.getClassName(), 'search', { value });
    this.resetStates();
    this.queryState.searching = value !== '';
    this.queryService.setFilterItem(this.queryState.queryType, 'search', value);

    if (!this.queryState.searching) {
      this.addCurrentToSelections();
    }

    this.loadItems();
  }

  public shouldHandleScrollEvent(atBottom: boolean) {
    let retVal = atBottom;
    retVal &&= !this.queryState.loading;
    retVal &&= this.state.itemsRaw.length < this.queryState.totalItems;

    return retVal;
  }

  public prepareCombobox(value) {
    this.queryService.deleteFilterItems(this.queryState.queryType, 'search');
    if (lodash.isEmpty(this.value)) {
      this.combobox.input.nativeElement.value = '';
      this.combobox.onSearch('', false);
    }
    this.loadData(value);
  }

  protected loadData(value) {
    _debugX(BaseCombobox.getClassName(), `loadData`, { value });
    this.value = value;
    this.resetStates();
    this.queryService.deleteFilterItems(this.queryState.queryType, 'search');
    this.addCurrentToSelections();
    this.loadItems();
  }

  protected resetStates() {
    this.state = lodash.cloneDeep(this._state);
    this.queryState = lodash.cloneDeep(this._queryState);
  }

  protected abstract addCurrentToSelections(): void;
  protected abstract loadItems(): void;
}
