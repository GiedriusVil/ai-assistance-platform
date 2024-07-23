/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aiap-test-case-documentation-v1',
  templateUrl: './test-case-documentation-v1.html',
  styleUrls: ['./test-case-documentation-v1.scss']
})
export class TestCaseDocumentationV1 implements OnInit {

  static getClassName() {
    return 'TestCaseDocumentationV1';
  }

  markdown: any = `
    ----
    Test case related training & tutorial material will be provissioned here.

    

    ###### Script
    \`\`\`json
    {
        convos: [
            ...,
            {
                name: "Test case name",
                description: "Test case description",
                steps: [
                    {
                        begin: [
                            {
                                logichook: "PAUSE",
                                args: "5000"
                            }
                        ]
                    },
                    {
                        me: [
                            "",
                            "PAUSE 1000"
                        ]
                    },
                    {
                        bot: [
                            "Hello from aca-assistant. How can I help you?"
                        ]
                    },
                    {
                        me: [
                            "Hey"
                        ]
                    },
                    {
                        bot: [
                            "I didn't understand. You can try rephrasing."
                        ]
                    }
                ]
            }
            ...,
        ]
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
