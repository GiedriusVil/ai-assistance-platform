/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-cards-panel-v1',
  templateUrl: './cards-panel-v1.html',
  styleUrls: ['./cards-panel-v1.scss'],
})
export class CardsPanelV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'CardsPanelV1';
  }

  @Input() items: any;
  @Output() onShowDeletePlace = new EventEmitter<any>();
  @Output() onShowSavePlace = new EventEmitter<any>();
  @Output() onShowSearchPlace = new EventEmitter<any>();

  @ViewChild('datasourceSearch', { static: true }) datasourceSearch;

  public _destroyed$: Subject<void> = new Subject();

  _state = {
    selectedCards: [],
    items: [],
  }

  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.state.items = this.items;
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  isRemoveDisabled() {
    const RET_VAL = lodash.isEmpty(this.state.selectedCards);
    return RET_VAL;
  }

  handleDatasourceAdd(value = undefined) {
    if (lodash.isEmpty(value?.id)) {
      this.onShowSavePlace.emit();
    } else {
      this.onShowSavePlace.emit(value);
    }
    this.resetSearchFieldInput();
  }

  handleDatasourcesRemove() {
    const RET_VAL = {
      ids: this.state.selectedCards
    };
    this.onShowDeletePlace.emit(RET_VAL);
    this.state = lodash.cloneDeep(this._state);
    this.resetSearchFieldInput();
  }

  hanleClearSearchEvent(event: any) {
    this.state.items = lodash.cloneDeep(this.items);
  }

  resetSearchFieldInput() {
    const INPUT_FIELD = this.datasourceSearch;
    if (
      !lodash.isEmpty(INPUT_FIELD)
    ) {
      this.datasourceSearch.value = '';
    }
  }

  handleSearchEvent(searchText) {
    const NEW_DATASOURCES = lodash.cloneDeep(this.items);
    const PATTERN = new RegExp(`^${searchText}`);
    const FILTERED_DATASOUCES_BY_SEARCH_TEXT = lodash.filter(NEW_DATASOURCES, datasource => PATTERN.test(datasource.type));
    this.state.items = FILTERED_DATASOUCES_BY_SEARCH_TEXT;
  }

  handleCardToggle(selectedCard) {
    const SELECTED_CARD_ID = selectedCard?.id;
    const IS_CARD_CHECKED = selectedCard?.checked;
    const IS_ID_INCLUDED = this.state.selectedCards.includes(SELECTED_CARD_ID);
    if (
      IS_CARD_CHECKED &&
      !IS_ID_INCLUDED
    ) {
      this.state.selectedCards.push(SELECTED_CARD_ID);
    } else if (
      !IS_CARD_CHECKED &&
      IS_ID_INCLUDED
    ) {
      this.state.selectedCards = lodash.without(this.state.selectedCards, SELECTED_CARD_ID);
    }

  }

}
