/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';

@Component({
  selector: 'aca-example-component',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent {

  getClassName() {
    return 'ExampleComponent';
  }

  name = 'world';
}
