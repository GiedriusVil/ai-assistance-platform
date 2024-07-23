/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'aiap-test-execution-documentation-v1',
  templateUrl: './test-execution-documentation-v1.html',
  styleUrls: ['./test-execution-documentation-v1.scss']
})
export class TestExecutionDocumentationV1 implements OnInit {

  static getClassName() {
    return 'TestExecutionDocumentationV1';
  }

  markdown: any = `
    ----
    Execution related training & tutorial material will be provissioned here.

    

    ###### Configuration
    \`\`\`json
    {
        Capabilities: {

        },
        Sources: {

        },
        Envs: {

        }
    }
    \`\`\`
    `;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

}
