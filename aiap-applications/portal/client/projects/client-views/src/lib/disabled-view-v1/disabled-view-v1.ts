/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'aiap-disabled-view-v1',
  templateUrl: './disabled-view-v1.html',
  styleUrls: ['./disabled-view-v1.scss'],
})
export class DisabledViewV1 {

  @Input() title = 'disabled_view_v1.title';
  @Input() message = 'disabled_view_v1.message';

  constructor() {
    //
  }
}
