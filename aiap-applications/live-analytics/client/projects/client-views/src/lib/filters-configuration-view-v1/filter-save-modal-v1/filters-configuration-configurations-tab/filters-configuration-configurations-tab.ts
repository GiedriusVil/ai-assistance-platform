/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import { DEFAULT_CONFIGURATION } from '../filter-save-modal-v1.utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-filters-configuration-tab',
  templateUrl: './filters-configuration-configurations-tab.html',
  styleUrls: ['./filters-configuration-configurations-tab.scss']
})
export class FiltersConfigurationTab implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'FiltersConfigurationTab';
  }

  @Input() filter;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  value: any;

  constructor() {
    //
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Filter Configurations';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  ngOnChanges(event: any) {
    setTimeout(() => {
      this.refreshValue(this.filter);
    }, 0);
  }

  refreshValue(filter) {
    if (
      lodash.isEmpty(filter.configuration) &&
      !lodash.isEmpty(filter.type)
    ) {
      const LOWERCASE_TYPE = filter?.type?.value.toLowerCase();
      this.value = DEFAULT_CONFIGURATION[LOWERCASE_TYPE];
    } else {
      this.value = filter?.configuration;
    }
  }

  handleChangeEvent(event: any) {
    try {
      if (
        event?.type === 'change'
      ) {
        const JSON_EDITOR_VALUE = this.jsonEditor.get()
        _debugX(FiltersConfigurationTab.getClassName(), 'handleChangeEvent',
          {
            event,
            JSON_EDITOR_VALUE,
          });
        this.valueChange.emit(JSON_EDITOR_VALUE);
      }
    } catch (error) {
      _errorX(FiltersConfigurationTab.getClassName(), 'handleChangeEvent', {
        event,
        error,
      });
    }
  }

  isValid(): boolean {
    try {
      const RET_VAL: boolean = this.jsonEditor.isValidJson();
      return RET_VAL;
    } catch (error) {
      _errorX(FiltersConfigurationTab.getClassName(), 'getValue',
        {
          error,
        });

      throw error;
    }
  }

  getValue() {
    let retVal;
    try {
      const RET_VAL = this.jsonEditor.get();
      return RET_VAL;
    } catch (error) {
      _errorX(FiltersConfigurationTab.getClassName(), 'getValue',
        {
          error,
        });

      throw error;
    }
  }

}
