/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { OnInit, OnDestroy, AfterViewInit, Component, Input, OnChanges, ViewChild, ViewContainerRef, TemplateRef } from "@angular/core";

import * as lodash from 'lodash';

import {
  _errorX,
} from 'client-shared-utils'

@Component({
  selector: 'aca-engagement-styles-tab',
  templateUrl: './engagement-styles-tab.html',
  styleUrls: ['./engagement-styles-tab.scss'],
})
export class EngagementStylesTab implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  static getClassName() {
    return 'EngagementStylesTab';
  }

  @Input() engagement;

  @ViewChild("monacoEditor", { read: TemplateRef }) monacoEditor: TemplateRef<any>;
  @ViewChild("monacoContainer", { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  _styles = {
    value: ''
  };

  styles = lodash.cloneDeep(this._styles);
  state = {
    monacoOptions: {
      theme: 'hc-black',
      language: 'scss',
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

  constructor() { }

  ngOnInit() { };

  ngOnDestroy() { };

  ngAfterViewInit() { };

  ngOnChanges() {
    setTimeout(() => {
      this.refreshStyles(this.engagement);
    }, 0);
  }

  isValid() {
    try {
      const RET_VAL = true;
      // [LEGO] PLACE_HOLDER -> Need to figure out how to get errors from editor!
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementStylesTab.getClassName(), 'isValid', { error });
      throw error;
    }
  }

  getValue() {
    try {
      const RET_VAL = lodash.cloneDeep(this.styles);
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementStylesTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

  refreshStyles(engagement) {
    if (
      !lodash.isEmpty(engagement?.styles?.value)
    ) {
      this.styles.value = engagement.styles?.value;
    } else {
      this.styles = lodash.cloneDeep(this._styles);
    }
  }

  clearMonacoContainer() {
    this.monacoContainer.clear();
  }

  createMonacoEditor() {
    this.monacoContainer.createEmbeddedView(this.monacoEditor);
  }
}
