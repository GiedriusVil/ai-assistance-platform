/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-tenant-tab-object-storage-v1',
  templateUrl: './tenant-tab-object-storage-v1.html',
  styleUrls: ['./tenant-tab-object-storage-v1.scss'],
})
export class TenantTabObjectStorageV1 implements OnChanges, OnInit {

  static getClassName() {
    return 'TenantTabObjectStorageV1';
  }

  @Input() objectStorage: any;

  _selections: any = {
    objectStorageTypes: [
      {
        content: 'Minio',
        value: 'minio'
      },
      {
        content: 'IBM Cloud Object Storage',
        value: 'ibm_cloud'
      }
    ],
    objectStorageType: undefined,
  };

  selections = lodash.cloneDeep(this._selections);

  ngOnInit() {
    this.setSelections();
  }

  ngOnChanges() {
    this.setSelections();
  }

  setSelections() {
    this.selections = lodash.cloneDeep(this._selections);
    this.setStorageTypesSelections(this.objectStorage);
  }

  private setStorageTypesSelections(objectStorage: any) {
    const STORAGE_TYPE_SELECTED = objectStorage?.type;
    for (const STORAGE_TYPE of this.selections.objectStorageTypes) {
      if (
        STORAGE_TYPE_SELECTED === STORAGE_TYPE?.value
      ) {
        STORAGE_TYPE.selected = true;
        this.selections.objectStorageType = STORAGE_TYPE;
        break;
      }
    }
  }

  handleStorageTypeSelectionEvent($event) {
    this.objectStorage.type = $event?.item?.value;
    this.setSelections();
  }

}
