/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-survey-results-card',
  templateUrl: './ms-survey-results-card.html',
  styleUrls: ['./ms-survey-results-card.scss']
})
export class MsSurveyResultsCard implements OnInit {

  static getClassName() {
    return 'MsSurveyResultsCard';
  }

  @Input() score: string;
  @Input() comment: string;

  constructor() { }

  ngOnInit(): void { }

}
