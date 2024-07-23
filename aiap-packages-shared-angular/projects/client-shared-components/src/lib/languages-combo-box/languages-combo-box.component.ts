/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  LANGUAGE_LIST,
} from 'client-shared-utils';

@Component({
  selector: 'aca-languages-combo-box',
  templateUrl: './languages-combo-box.component.html',
  styleUrls: ['./languages-combo-box.component.scss'],
})
export class AcaLanguagesComboBox implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AcaLanguagesComboBox';
  };

  private _destroyed$: Subject<void> = new Subject();

  @Input() value: any;
  @Input() label: any;
  @Input() placeholder: any;

  _selections: any = {
    items: [],
    selectedItem: undefined,
  };

  selections: any = lodash.cloneDeep(this._selections);

  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const SELECTIONS = lodash.cloneDeep(this._selections);
    const ITEMS = lodash.cloneDeep(LANGUAGE_LIST);
    const CURRENT_LANGUAGE = ramda.pathOr('', ['value', 'currentValue', 'language'], changes);
    const CURRENT_LANGUAGE_NAME = ramda.pathOr('', ['value', 'currentValue', 'languageName'], changes);
    SELECTIONS.items = this._transformItemsIntoDropDownItems(ITEMS);
    const SELECTED_ITEM = {
      content: lodash.cloneDeep(CURRENT_LANGUAGE_NAME),
      selected: true,
      language: CURRENT_LANGUAGE,
      languageName: lodash.cloneDeep(CURRENT_LANGUAGE_NAME)
    };
    SELECTIONS.selectedItem = lodash.cloneDeep(SELECTED_ITEM);
    this.selections = SELECTIONS;
    _debugX(AcaLanguagesComboBox.getClassName(), 'ngOnChanges', { changes, this_value: this.value, SELECTIONS });
  }

  handleSelectedEvent(event: any) {
    this.value.language = event?.item?.language;
    this.value.languageName = event?.item?.languageName;

    _debugX(AcaLanguagesComboBox.getClassName(), 'handleSelectedEvent', {
      event,
      this_value: this.value,
      this_selections: this.selections
    });
  }

  _transformItemsIntoDropDownItems(items: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(items) &&
      lodash.isArray(items)
    ) {
      for (let item of items) {
        let tmpItem = this._transformItemIntoDropDownItem(item);
        if (tmpItem) {
          RET_VAL.push(tmpItem);
        }
      }
    }
    return RET_VAL;
  }

  _transformItemIntoDropDownItem(item: any) {
    let retVal;
    if (
      !lodash.isEmpty(item?.name) &&
      !lodash.isEmpty(item?.code)
    ) {
      const ITEM_LANGUAGE = item?.code;
      const ITEM_LANGUAGE_NAME = item?.name;
      let isSelected = false;
      if (
        this.value
      ) {
        isSelected = ITEM_LANGUAGE_NAME === this.value?.languageName;
      }
      retVal = {
        content: ITEM_LANGUAGE_NAME,
        selected: isSelected,
        language: ITEM_LANGUAGE,
        languageName: ITEM_LANGUAGE_NAME
      };
    }
    return retVal;
  }
}
