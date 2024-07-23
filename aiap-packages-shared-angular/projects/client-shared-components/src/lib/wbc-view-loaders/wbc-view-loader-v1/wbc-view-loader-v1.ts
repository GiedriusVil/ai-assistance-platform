/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-wbc-view-loader-v1',
  templateUrl: './wbc-view-loader-v1.html',
  styleUrls: ['./wbc-view-loader-v1.scss']
})
export class WbcViewLoaderV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'WbcViewLoaderV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() params: any;
  @Output() paramsChanges = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(WbcViewLoaderV1.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_context: this.context,
      this_params: this.params,
    });
  }

  ngOnDestroy() { }

  url() {
    const RET_VAL = this.context?.wbc?.host + this.context?.wbc?.path;
    return RET_VAL;
  }

  applicationLoadingText() {
    return `Waiting for application ${this.context?.wbc?.tag} to load from ${this.context?.wbc?.host}${this.context?.wbc?.path}!`;
  }

}
