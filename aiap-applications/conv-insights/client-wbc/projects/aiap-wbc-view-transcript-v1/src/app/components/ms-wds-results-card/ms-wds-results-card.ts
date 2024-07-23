/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-wds-results-card',
  templateUrl: './ms-wds-results-card.html',
  styleUrls: ['./ms-wds-results-card.scss']
})
export class MsWdsResultsCard implements OnInit {

  static getClassName() {
    return 'MsWdsResultsCard';
  }

  @Input() filename: string;
  @Input() documentUrl: string;
  @Input() passageText: string;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {

  }
}
