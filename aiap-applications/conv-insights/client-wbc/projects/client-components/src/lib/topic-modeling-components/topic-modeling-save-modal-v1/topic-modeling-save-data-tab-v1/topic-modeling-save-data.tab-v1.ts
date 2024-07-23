/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
    selector: 'aiap-topic-modeling-save-data-tab-v1',
    templateUrl: './topic-modeling-save-data.tab-v1.html',
    styleUrls: ['./topic-modeling-save-data.tab-v1.scss'],
})
export class TopicModelingSaveDataTabV1 implements OnInit, OnDestroy {

    static getClassName() {
        return 'TopicModelingSaveDataTabV1';
    }

    private _destroyed$: Subject<void> = new Subject();

    @Input() value;

    selections: any = {
        instructionsExpanded: false,
    }

    constructor() { }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    getValue() {
       
    }

  isValid() {
      
    }
}
