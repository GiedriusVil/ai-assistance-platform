/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  ConfigServiceV1,
} from "client-services";

@Component({
  selector: 'app-error',
  templateUrl: './error.html',
  styleUrls: ['./error.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit {

  param: { title: string };

  constructor(private configService: ConfigServiceV1) { }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    const CONFIG = this.configService.get();
    this.param = { title: CONFIG['title'] || 'the bot' };
  }
}
