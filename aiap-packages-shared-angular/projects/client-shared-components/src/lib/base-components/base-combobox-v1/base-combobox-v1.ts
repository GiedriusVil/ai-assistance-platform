/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, SimpleChanges, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { catchError, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  template: ''
})
export abstract class BaseComboboxV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'BaseComboboxV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  @Input() label: any;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  initialized: boolean = false;

  _onCloseEvent: any = undefined;

  _state: any = {
    skeleton: false,
    selectionType: this.defaultSelectionType(),
    size: 'md',
    query: this.defaultQuery(),
    selections: [],
    selected: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit(): void {
    _debugX(BaseComboboxV1.getClassName(), 'ngOnInit',
      {});
    this.loadItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(BaseComboboxV1.getClassName(), 'ngOnChanges',
      {
        changes,
      });

    this.refreshStateSellected();
  }

  ngOnDestroy(): void {
    _debugX(BaseComboboxV1.getClassName(), 'ngOnDestroy',
      {});
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  protected isMultiEnabled() {
    const RET_VAL = 'multi' === this.state?.selectionType;
    return RET_VAL;
  }

  private loadItems() {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.skeleton = true;
    this.state = STATE_NEW;
    _debugX(BaseComboboxV1.getClassName(), 'loadItems',
      {
        STATE_NEW
      });
    this.observeItemsLoad(this.state).pipe(
      catchError(error => this.handleFindManyByQueryError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(BaseComboboxV1.getClassName(), 'loadItems',
        {
          response
        });
      const STATE_NEW = lodash.cloneDeep(this.state);
      this.appendItemsToState(response?.items, STATE_NEW);
      STATE_NEW.skeleton = false;
      this.state = STATE_NEW;
      this.initialized = true;
    })
  }

  private refreshStateSellected() {
    const STATE_NEW = lodash.cloneDeep(this.state);
    const SELECTED = [];
    const VALUES = [];
    if (
      !lodash.isEmpty(STATE_NEW?.selections) &&
      lodash.isArray(STATE_NEW?.selections)
    ) {
      if (
        this.isMultiEnabled() &&
        lodash.isArray(this.value)
      ) {
        VALUES.push(...this.value);
      } else {
        VALUES.push(this.value);
      }
      for (let selection of STATE_NEW?.selections) {
        delete selection.selected;
        const TMP_ITEM = VALUES.find((value: any) => {
          const CONDITION = this.isEqualItemWithSelection(value, selection);
          return CONDITION;
        });
        if (
          TMP_ITEM
        ) {
          selection.selected = true;
          SELECTED.push(selection);
        }
      }
    }
    if (
      this.isMultiEnabled()
    ) {
      STATE_NEW.selected = SELECTED;
    } else {
      STATE_NEW.selected = ramda.path([0], SELECTED);
    }

    this.state = STATE_NEW;
  }

  protected appendItemsToState(items: any, state: any) {
    const SELECTIONS = [];
    const SELECTED = [];
    const VALUES = [];
    if (
      !lodash.isEmpty(items) &&
      lodash.isArray(items)
    ) {
      if (
        this.isMultiEnabled() &&
        lodash.isArray(this.value)
      ) {
        VALUES.push(...this.value);
      } else {
        VALUES.push(this.value);
      }
      for (let item of items) {
        const SELECTION = this.transformItemIntoSelection(item);
        const TMP_ITEM = VALUES.find((value: any) => {
          const CONDITION = this.isEqualItemWithSelection(value, SELECTION);
          return CONDITION;
        });
        if (
          TMP_ITEM
        ) {
          SELECTION.selected = true;
          SELECTED.push(SELECTION);
        }
        SELECTIONS.push(SELECTION);
      }
    }
    state.selections = SELECTIONS;
    if (
      this.isMultiEnabled()
    ) {
      state.selected = SELECTED;
    } else {
      state.selected = ramda.path([0], SELECTED);
    }
  }

  protected handleCloseEvent(event: any) {
    _debugX(BaseComboboxV1.getClassName(), 'handleCloseEvent',
      {
        event
      });
    if (
      this.isMultiEnabled()
    ) {
      const ITEMS = [];
      const ITEMS_SELECTED = lodash.cloneDeep(this.state?.selected);
      if (
        lodash.isArray(ITEMS_SELECTED)
      ) {
        ITEMS.push(...ITEMS_SELECTED);
      }
      this.emitValueChangeEvent(ITEMS);
    }
  };

  protected handleSelectedEvent(event: any) {
    _debugX(BaseComboboxV1.getClassName(), 'handleSelectedEvent',
      {
        event
      });
    if (
      !this.isMultiEnabled()
    ) {
      const ITEMS = [];
      const ITEMS_SELECTED = lodash.cloneDeep(this.state?.selected);
      ITEMS.push(ITEMS_SELECTED);
      this.emitValueChangeEvent(ITEMS);
    }
  };

  protected abstract emitValueChangeEvent(items: any): void;

  protected abstract defaultSelectionType(): string;

  protected abstract defaultQuery(): any;

  protected abstract observeItemsLoad(state: any): Observable<any>;

  protected abstract handleFindManyByQueryError(error: any): Observable<any>;

  protected abstract transformItemIntoSelection(item: any): any;

  protected abstract isEqualItemWithSelection(item: any, selection: any): boolean;

  protected abstract handleSubmitEvent(event: any): void;

}
