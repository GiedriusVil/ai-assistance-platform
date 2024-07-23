/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'aiap-wbc-validation-engagements-general-tab-v1',
  templateUrl: './validation-engagements-general-tab-v1.html',
  styleUrls: ['./validation-engagements-general-tab-v1.scss'],
})
export class ValidationEngagementsGeneralTabV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ValidationEngagementsGeneralTabV1';
  }

  @Input() validationEngagement = undefined;

  ngOnInit(): void { }

  ngOnDestroy(): void { }
}
