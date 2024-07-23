/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'aca-classifier-model-save-classifier-docs',
  templateUrl: './classifier-model-save-classifier-docs-v1.html',
  styleUrls: ['./classifier-model-save-classifier-docs-v1.scss']
})
export class ClassifierModelSaveClassifierDocs implements OnInit {

  static getClassName() {
    return 'ClassifierModelSaveClassifierDocs';
  }

  markdown: any = `
    ----
    ##### Examples
    ###### Nayve Bayas (multinomial_nb)
    \`\`\`json
    {
        "type": "multinomial_nb",
        "configuration": {
            "model_type": "skl",
            "vectorizer": "tfidf",
            "base_model": "multinomial_nb",
            "preprocessor": "multinomial_nb"
        }
    }
    \`\`\`

    ###### Convolutional Neural Network (cnn)
    \`\`\`json
    {
        "type": "cnn",
        "configuration": {
            "model_type": "fallback",
            "fallback_configs": {
                "a": {
                    "model_type": "wordmatch",
                    "preprocessor": "wordmatch"
                },
                "b": {
                    "model_type": "cnn4",
                    "preprocessor": "cnn"
                }
            }
        }
    }
    \`\`\`

    ###### DistilBert (transformers)
    \`\`\`json
    {
        "type": "transformers",
        "configuration": {
            "model_type": "fallback",
            "fallback_configs": {
                "a": {
                    "model_type": "wordmatch",
                    "preprocessor": "wordmatch"
                },
                "b": {
                    "model_type": "transformers",
                    "preprocessor": "transformers",
                    "pretrained_checkpoint": "distilbert-base-uncased",
                    "batch_size": 4,
                    "epochs": 4,
                    "max_length": 40
                }
            }
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
