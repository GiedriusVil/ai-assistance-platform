/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-survey-questions-card',
  templateUrl: './ms-survey-questions-card.component.html',
  styleUrls: ['./ms-survey-questions-card.component.scss']
})
export class MsSurveyQuestionsCardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  values = {
    description: 'Kuinka tyytyväinen olet IT-botin kanssa käymäsi keskustelun laatuun?',
    satisfactionValueDissatisfied: 'Tyytymätön',
    satisfactionValueNeutral: 'Neutraali',
    satisfactionValueSatisfied: 'Tyytyväinen',
    satisfactionValueVeryDissatisfied: 'Erittäin tyytymätön',
    satisfactionValueVerySatisfied: 'Erittäin tyytyväinen'
  }
} 
