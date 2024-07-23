/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnChanges, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { DiffEditorModel } from 'ngx-monaco-editor-v2';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

@Component({
  selector: 'aca-json-difference',
  templateUrl: './json-difference.component.html',
  styleUrls: ['./json-difference.component.scss']
})
export class AcaJsonDifference implements OnInit, OnChanges {

  static getClassName() {
    return 'AcaJsonDifference';
  }

  @ViewChild("monacoEditor", { read: TemplateRef }) monacoEditor: TemplateRef<any>;
  @ViewChild("monacoContainer", { read: ViewContainerRef }) monacoContainer: ViewContainerRef;

  @Input() source: any;
  @Input() target: any;
  @Input() monacoOptions: any;

  @Input() detailedDiff: boolean;
  @Input() detailedDiffComparisonKey: string;

  _differences: any = {
    unmodified: [],
    unmodifiedCount: 0,
    modified: {
      source: [],
      target: [],
    },
    modifiedCount: 0,
    added: [],
    addedCount: 0,
    removed: [],
    removedCount: 0,
  }

  _state = {
    monacoOptions: {
      theme: 'vs-dark',
      language: 'json',
      wordWrap: true,
      automaticLayout: true,
      readOnly: true,
    },
    showUnmodified: true,
    showModified: true,
    showAdded: true,
    showRemoved: true,
  }

  _monacoDiffOriginal: DiffEditorModel = {
    code: '',
    language: 'json',
  }
  _monacoDiffModified: DiffEditorModel = {
    code: '',
    language: 'json'
  }

  differences: any = lodash.cloneDeep(this._differences);
  state: any = lodash.cloneDeep(this._state);
  monacoDiffOriginal: DiffEditorModel = lodash.cloneDeep(this._monacoDiffOriginal);
  monacoDiffModified: DiffEditorModel = lodash.cloneDeep(this._monacoDiffModified);


  ngOnInit() {
    this.refreshEditor();
  }

  ngOnChanges() {
    this.refreshEditor();
  }

  refreshEditor() {
    if (
      this.detailedDiff &&
      !lodash.isEmpty(this.detailedDiffComparisonKey) &&
      lodash.isArray(this.source) &&
      lodash.isArray(this.target)
    ) {
      this.differences = lodash.cloneDeep(this._differences);
      this.findDifferencesBetweenSourceAndTarget();
      this.constructDetailedDiffModels();
    } else {
      this.constructBasicDiffModels();
    }
  }

  findDifferencesBetweenSourceAndTarget() {
    this.differences.unmodified = this.getUnmodifiedItems();
    this.differences.unmodifiedCount = this.differences.unmodified.length || 0;
    this.differences.modified = this.getModifiedItems();
    this.differences.modifiedCount = this.differences.modified.source.length || 0;
    this.differences.added = this.getAddedItems();
    this.differences.addedCount = this.differences.added.length || 0;
    this.differences.removed = this.getRemovedItems();
    this.differences.removedCount = this.differences.removed.length || 0;
  }

  constructDetailedDiffModels() {
    let orderedSourceArray = [];
    let orderedTargetArray = [];

    const UNMODIFIED = this.differences.unmodified;
    const MODIFIED = this.differences.modified;
    const ADDED = this.differences.added;
    const REMOVED = this.differences.removed;

    if (this.state.showModified) {
      orderedSourceArray = orderedSourceArray.concat(MODIFIED.source);
      orderedTargetArray = orderedTargetArray.concat(MODIFIED.target);
    }
    if (this.state.showUnmodified) {
      orderedSourceArray = orderedSourceArray.concat(UNMODIFIED);
      orderedTargetArray = orderedTargetArray.concat(UNMODIFIED);
    }
    if (this.state.showAdded) {
      orderedTargetArray = orderedTargetArray.concat(ADDED);
    }
    if (this.state.showRemoved) {
      orderedSourceArray = orderedSourceArray.concat(REMOVED);
    }

    this.monacoDiffOriginal = this.convertItemToDiffModel(orderedSourceArray);
    this.monacoDiffModified = this.convertItemToDiffModel(orderedTargetArray);
  }

  constructBasicDiffModels() {
    this.monacoDiffOriginal = this.convertItemToDiffModel(this.source);
    this.monacoDiffModified = this.convertItemToDiffModel(this.target);
  }

  getUnmodifiedItems() {
    const RET_VAL = this.source.filter(sourceItem => this.target.some(targetItem => lodash.isEqual(targetItem, sourceItem)));
    return RET_VAL;
  }

  getModifiedItems() {
    const MODIFIED_SOURCE = [];
    const MODIFIED_TARGET = [];
    for (let sourceItem of this.source) {
      for (let targetItem of this.target) {
        const SOURCE_KEY = ramda.path([this.detailedDiffComparisonKey], sourceItem);
        const TARGET_KEY = ramda.path([this.detailedDiffComparisonKey], targetItem);
        if (
          SOURCE_KEY === TARGET_KEY &&
          !lodash.isEqual(sourceItem, targetItem)
        ) {
          MODIFIED_SOURCE.push(sourceItem);
          MODIFIED_TARGET.push(targetItem);
          break;
        }
      }
    }
    const RET_VAL = {
      source: MODIFIED_SOURCE,
      target: MODIFIED_TARGET,
    };
    return RET_VAL;
  }

  getAddedItems() {
    const RET_VAL = this.target.filter(targetItem => {
      const TARGET_FOUND_IN_SOURCE = this.source.some(sourceItem => {
        const TARGET_ITEM_KEY = ramda.path([this.detailedDiffComparisonKey], targetItem);
        const SOURCE_ITEM_KEY = ramda.path([this.detailedDiffComparisonKey], sourceItem);
        return TARGET_ITEM_KEY === SOURCE_ITEM_KEY;
      });
      return !TARGET_FOUND_IN_SOURCE;
    });
    return RET_VAL;
  }

  getRemovedItems() {
    const RET_VAL = this.source.filter(sourceItem => {
      const SOURCE_FOUND_IN_TARGET = this.target.some(targetItem => {
        const SOURCE_ITEM_KEY = ramda.path([this.detailedDiffComparisonKey], sourceItem);
        const TARGET_ITEM_KEY = ramda.path([this.detailedDiffComparisonKey], targetItem);
        return SOURCE_ITEM_KEY === TARGET_ITEM_KEY;
      });
      return !SOURCE_FOUND_IN_TARGET;
    });
    return RET_VAL;
  }

  convertItemToDiffModel(item) {
    const CODE = JSON.stringify(item, null, '  ');
    const RET_VAL = {
      code: CODE,
      language: 'text/plain'
    };
    return RET_VAL;
  }

  handleShowUnmodifiedToggle() {
    this.state.showUnmodified = !this.state.showUnmodified;
    this.constructDetailedDiffModels();
  }

  handleShowModifiedToggle() {
    this.state.showModified = !this.state.showModified;
    this.constructDetailedDiffModels();
  }

  handleShowAddedToggle() {
    this.state.showAdded = !this.state.showAdded;
    this.constructDetailedDiffModels();
  }

  handleShowRemovedToggle() {
    this.state.showRemoved = !this.state.showRemoved;
    this.constructDetailedDiffModels();
  }

  isUnmodifiedToggleDisabled() {
    const RET_VAL = this.differences.unmodifiedCount === 0;
    return RET_VAL;
  }

  isModifiedToggleDisabled() {
    const RET_VAL = this.differences.modifiedCount === 0;
    return RET_VAL;
  }

  isAddedTogleDisabled() {
    const RET_VAL = this.differences.addedCount === 0;
    return RET_VAL;
  }

  isRemovedToggleDisabled() {
    const RET_VAL = this.differences.removedCount === 0;
    return RET_VAL;
  }

  clearMonacoContainer() {
    this.monacoContainer.clear();
  }

  createMonacoEditor() {
    this.monacoContainer.createEmbeddedView(this.monacoEditor);
  }
}
