/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'aiap-test-worker-documentation-v1',
  templateUrl: './test-worker-documentation-v1.html',
  styleUrls: ['./test-worker-documentation-v1.scss']
})
export class TestWorkerDocumentationV1 implements OnInit {

  static getClassName() {
    return 'TestWorkerDocumentationV1';
  }

  markdown: any = `
    ----
    Worker related training & tutorial material will be provissioned here.

    

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
