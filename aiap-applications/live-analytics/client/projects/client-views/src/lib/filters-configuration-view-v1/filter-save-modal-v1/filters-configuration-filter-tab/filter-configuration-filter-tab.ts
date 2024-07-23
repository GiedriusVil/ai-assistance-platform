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
  OnChanges,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _errorX,
} from 'client-shared-utils';

import { DEFAULT_CODE } from '../filter-save-modal-v1.utils';

@Component({
  selector: 'aca-filters-configuration-filter-tab',
  templateUrl: './filter-configuration-filter-tab.html',
  styleUrls: ['./filter-configuration-filter-tab.scss'],
})
export class FiltersConfigurationFilterTab implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  static getClassName() {
    return 'FiltersConfigurationFilterTab';
  }

  @Input() filter;

  @ViewChild('monacoEditor', { read: TemplateRef }) monacoEditor: TemplateRef<any>;
  @ViewChild('monacoContainer', { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  _filters = {
    value: DEFAULT_CODE
  };

  filters = lodash.cloneDeep(this._filters);
  state = {
    monacoOptions: {
      theme: 'hc-black',
      language: 'javascript',
      minimap: {
        enabled: false
      },
      automaticLayout: true,
      padding: {
        bottom: 20
      },
      scrollbar: {
        vertical: 'hidden'
      },
    }
  };

  constructor() {
    //
  }

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
      this.refreshStyles(this.filter);
    }, 0);
  }

  isValid() {
    try {
      const RET_VAL = true;
      // [LEGO] PLACE_HOLDER -> Need to figure out how to get errors from editor!
      return RET_VAL;
    } catch (error) {
      _errorX(FiltersConfigurationFilterTab.getClassName(), 'isValid', { error });
      throw error;
    }
  }

  getValue() {
    try {
      const RET_VAL = lodash.cloneDeep(this.filters);
      return RET_VAL;
    } catch (error) {
      _errorX(FiltersConfigurationFilterTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

  refreshStyles(filter) {
    if (
      !lodash.isEmpty(filter?.code)
    ) {
      this.filters.value = filter?.code;
    } else {
      this.filters = lodash.cloneDeep(this._filters);
    }
  }

  clearMonacoContainer() {
    this.monacoContainer.clear();
  }

  createMonacoEditor() {
    this.monacoContainer.createEmbeddedView(this.monacoEditor);
  }
}
