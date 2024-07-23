/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-survey-questions-card',
  templateUrl: './ms-survey-questions-card.html',
  styleUrls: ['./ms-survey-questions-card.scss']
})
export class MsSurveyQuestionsCard implements OnInit {

  static getClassName() {
    return 'MsSurveyQuestionsCard';
  }

  @Input() language: string;

  constructor() { }

  ngOnInit(): void {
  }

  TRANSLATIONS = {
    fi: {
      description: 'Kuinka tyytyväinen olet IT-botin kanssa käymäsi keskustelun laatuun?',
      satisfactionValueDissatisfied: 'Tyytymätön',
      satisfactionValueNeutral: 'Neutraali',
      satisfactionValueSatisfied: 'Tyytyväinen',
      satisfactionValueVeryDissatisfied: 'Erittäin tyytymätön',
      satisfactionValueVerySatisfied: 'Erittäin tyytyväinen'
    }
  }
}
