/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-survey-results-card',
  templateUrl: './ms-survey-results-card.component.html',
  styleUrls: ['./ms-survey-results-card.component.scss']
})
export class MsSurveyResultsCardComponent implements OnInit {

  @Input() score: string;
  @Input() comment: string;

  constructor() { }

  ngOnInit(): void {
  }

}
