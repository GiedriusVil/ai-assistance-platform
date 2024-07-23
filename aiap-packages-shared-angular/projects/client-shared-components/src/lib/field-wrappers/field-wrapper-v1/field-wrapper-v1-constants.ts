/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const DEFAULT_CONTEXT_FIELD_LABEL = `Value*`

export const DEFAULT_CONTEXT_FIELD_WRAPPER_V1 = {
  type: 'string',
  wbc: {
    host: undefined,
    path: undefined,
    tag: undefined,
  },
  string: {
    heperText: 'Provide string value...',
    label: DEFAULT_CONTEXT_FIELD_LABEL,
  },
  number: {
    heperText: 'Provide number value...',
    label: DEFAULT_CONTEXT_FIELD_LABEL,
    max: Number.POSITIVE_INFINITY,
    min: Number.NEGATIVE_INFINITY,
    precision: 1,
    step: 1,
  },
  date: {
    dateFormat: "Y-m-d",
    heperText: 'Provide date value...',
    label: DEFAULT_CONTEXT_FIELD_LABEL,
    placeholder: "yyyy-mm-dd",
  },
}
