/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  _debugX
} from "client-utils";

@Component({
  selector: 'aca-chat-loading-view',
  templateUrl: './loading.view.html',
  styleUrls: ['./loading.view.scss']
})
export class LoadingView implements OnInit, OnDestroy {

  static getClassName() {
    return 'LoadingView';
  }

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
