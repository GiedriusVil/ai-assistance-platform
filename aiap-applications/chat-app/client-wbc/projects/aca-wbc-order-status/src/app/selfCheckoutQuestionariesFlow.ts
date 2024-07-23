export const KCFRS_FLOW = [
  {
    id: 'KCFR004',
    questions: {
      '1': {
        node: '1',
        text: 'Does the contract have a defined value(with documented evidence prior contract signature)? (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        positiveResponse: {
          type: 'node',
          content: '2',
        },
        negativeResponse: {
          type: 'node',
          content: '6',
        },
      },
      '2': {
        node: '2',
        text: 'Is the contract signed by a Procurement employee? (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        positiveResponse: {
          type: 'node',
          content: '3',
        },
        negativeResponse: {
          type: 'node',
          content: '4',
        },
      },
      '3': {
        node: '3',
        text: 'Does the Procurement employee have sufficient and valid DPA to cover the defined or estimated / go-forward value?  (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR004 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR004 Completed: Possible Defect. (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        },
      },
      '4': {
        node: '4',
        text: 'Did Procurement authorize the non-Procurement employee to sign the agreement?',
        positiveResponse: {
          type: 'node',
          content: '5',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR004 Completed: Possible Defect. (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        },
      },
      '5': {
        node: '5',
        text: 'Does the Procurement employee who authorized the signature have sufficient and valid DPA to cover the defined or estimated/go-forward value?',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR004 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR004 Completed: Possible Defect. (Ref. Blue Book 3.1.3 Procurement Approval (DPA) Requirements for Agreements)',
        },
      },
      '6': {
        node: '6',
        text: 'Does the contract have a projected estimated value (with documented evidence prior contract signature)?',
        positiveResponse: {
          type: 'node',
          content: '3',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR004 Completed: Possible Defect.  Unable to verify correct DPA applied if the contract value is not documented.',
        },
      },
    },
  },
  {
    id: 'KCFR003-1',
    questions: {
      '1': {
        node: '1',
        text: 'Has the most current version of the Model Procurement Agreement (MPA) Template been used?',
        positiveResponse: {
          type: 'node',
          content: '2',
        },
        negativeResponse: {
          type: 'node',
          content: '4',
        },
      },
      '2': {
        node: '2',
        text: 'Are there any variations to Legal terms from the MPA template?',
        positiveResponse: {
          type: 'node',
          content: '3',
        },
        negativeResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR003.01 Completed: No possible defects.',
        },
      },
      '3': {
        node: '3',
        text: 'Did you obtain IBM Legal or/and IBM Trust and Compliance review?',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR003.01 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR003.01 Completed: Possible Defect.  (Ref. Blue Book 3.1.2 Requirements for Legal and Other Review of Agreements)',
        },
      },
      '4': {
        node: '4',
        text: 'Are all the Legal terms from the current template included in the version that was used?',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR003.01 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'node',
          content: '5',
        },
      },
      '5': {
        node: '5',
        text: 'Did you obtain IBM Legal or/and IBM Trust and Compliance review?',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR003.01 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR003.01 Completed: Possible Defect.  (Ref. Blue Book 3.1.2 Requirements for Legal and Other Review of Agreements)',
        },
      },
    },
  },
  {
    id: 'KCFR003-2',
    questions: {
      '1': {
        node: '1',
        text: 'Have both IBM and the Supplier signed the agreement (with at least one of the signatures dated, or the agreement containing an effective date. (Ref.  BB 3.1.8 Agreement Execution and Effective Date)?',
        positiveResponse: {
          type: 'node',
          content: '2',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR003.02 Completed: Possible Defect. (Ref.  BB 3.1.8 Agreement Execution and Effective Date)',
        },
      },
      '2': {
        node: '2',
        text: 'Was the IBM employee who signed the Agreement on behalf of IBM, authorized to sign Agreements for the IBM entity (including Power of Attorney for that entity, where required - that is, has it been confirmed with Legal that (a) POA is required, and (b) that the person signing has valid POA)?',
        positiveResponse: {
          type: 'noDefectsFinalMessage',
          content: 'KCFR003.02 Completed: No possible defects.',
        },
        negativeResponse: {
          type: 'defectFinalMessage',
          content:
            'KCFR003.02 Completed: Possible Defect. (Ref.  BB 3.1.4 Signature Requirements)',
        },
      },
    },
  },
];
