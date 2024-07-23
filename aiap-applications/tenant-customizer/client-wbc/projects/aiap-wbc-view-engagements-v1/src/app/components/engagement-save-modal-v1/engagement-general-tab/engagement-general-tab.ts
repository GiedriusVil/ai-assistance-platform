/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  OnInit,
  OnDestroy,
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import {
  SessionServiceV1
} from 'client-shared-services';

import * as lodash from 'lodash';

@Component({
  selector: 'aca-engagement-general-tab',
  templateUrl: './engagement-general-tab.html',
  styleUrls: ['./engagement-general-tab.scss'],
})
export class EngagementGeneralTab implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  static getClassName() {
    return 'EngagementGeneralTab';
  }

  @Input() engagement;
  @Output() generalTabData = new EventEmitter<any>();
  @Output() selectedAssistant = new EventEmitter<any>();

  constructor(
    private sessionService: SessionServiceV1,
  ) { }


  _generalData = {
    id: undefined,
    name: undefined,
    assistant: undefined,
    assistantDisplayName: undefined
  };

  _selections = {
    assistants: [],
    selectedAssistant: undefined,
  };

  selections = lodash.cloneDeep(this._selections);
  generalData = lodash.cloneDeep(this._generalData);


  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnChanges() {
    setTimeout(() => {
      this.generalData = this.engagement;
      this.refreshDropdownData();
    }, 0);
  }

  refreshDropdownData() {
    const SESSION_ASSISTANTS = this.sessionService.getAssistantsByTenant();
    this.selections.assistants = this._transformAssistantsIntoDropdownItems(SESSION_ASSISTANTS);
  }

  _transformAssistantsIntoDropdownItems(items: Array<any>) {
    const RET_VAL = [];
    if (
      items &&
      items.length > 0
    ) {
      for (const ITEM of items) {
        const TMP_OPTION = this._transformAssistantIntoDropdownItem(ITEM);
        if (
          TMP_OPTION
        ) {
          RET_VAL.push(TMP_OPTION);
        }
      }
    }
    return RET_VAL;
  }

  _transformAssistantIntoDropdownItem(item: any) {
    let retVal;
    if (item?.name && item?.id) {
      const IS_SELECTED = this.engagement?.assistant?.id === item.id;
      retVal = {
        content: `${item.name}`,
        selected: IS_SELECTED,
        id: item.id,
      }
      if (IS_SELECTED) {
        this.selections.selectedAssistant = retVal;
      }
    }
    return retVal;
  }

  getValue() {
    const RET_VAL = lodash.cloneDeep(this.generalData);
    RET_VAL.assistant = this.selections.selectedAssistant;
    return RET_VAL;
  }

  handleAssistantSelect(selectedItem) {

    this.selectedAssistant.emit(selectedItem.item);
  }
}
