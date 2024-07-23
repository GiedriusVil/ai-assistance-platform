/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const OPERATOR_TYPES = {
    EQUAL: 'equal',
    NOT_EQUAL: 'notEqual',
    LESS_THEN: 'lessThan',
    LESS_THEN_INCLUSIVE: 'lessThanInclusive',
    GREATER_THEN: 'greaterThan',
    GREATER_THEN_INCLUSIVE: 'greaterThanInclusive',
    IN: 'in',
    NOT_IN: 'notIn',
    CONTAINS: 'contains',
    DOES_NOT_CONTAIN: 'doesNotContain',
};

export const CONDITION_OPERATORS =
    [
        {
            content: OPERATOR_TYPES.EQUAL,
            value: {
                type: OPERATOR_TYPES.EQUAL,
            }
        },
        {
            content: OPERATOR_TYPES.NOT_EQUAL,
            value: {
                type: OPERATOR_TYPES.NOT_EQUAL,
            }
        },
        {
            content: OPERATOR_TYPES.LESS_THEN,
            value: {
                type: OPERATOR_TYPES.LESS_THEN,
            }
        },
        {
            content: OPERATOR_TYPES.LESS_THEN_INCLUSIVE,
            value: {
                type: OPERATOR_TYPES.LESS_THEN_INCLUSIVE,
            }
        },
        {
            content: OPERATOR_TYPES.GREATER_THEN,
            value: {
                type: OPERATOR_TYPES.GREATER_THEN,
            }
        },
        {
            content: OPERATOR_TYPES.GREATER_THEN_INCLUSIVE,
            value: {
                type: OPERATOR_TYPES.GREATER_THEN_INCLUSIVE,
            }
        },
        {
            content: OPERATOR_TYPES.IN,
            value: {
                type: OPERATOR_TYPES.IN,
            }
        },
        {
            content: OPERATOR_TYPES.NOT_IN,
            value: {
                type: OPERATOR_TYPES.NOT_IN,
            }
        },
        {
            content: OPERATOR_TYPES.CONTAINS,
            value: {
                type: OPERATOR_TYPES.CONTAINS,
            }
        },
        {
            content: OPERATOR_TYPES.DOES_NOT_CONTAIN,
            value: {
                type: OPERATOR_TYPES.DOES_NOT_CONTAIN,
            }
        },
    ];