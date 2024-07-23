/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  OnInit,
  OnDestroy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


@Component({
  selector: 'aiap-ai-service-tab-external-v1',
  templateUrl: './ai-service-tab-external-v1.html',
  styleUrls: ['./ai-service-tab-external-v1.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AiServiceTabExternalV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiServiceTabExternalV1';
  }

  @Input() aiService: any;
  @Output() aiServiceChange = new EventEmitter<any>();

  @Input() state: any;
  @Output() stateChange = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngOnChanges() {
    //
  }

}
