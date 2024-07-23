/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import * as lodash from 'lodash';

@Component({
  selector: 'aiap-left-panel-content',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  static getElementTag() {
    return 'aiap-left-panel-content';
  }

  title = 'aiap-left-panel-content';

  icons: any = {};

  constructor(
  ) { }
}
