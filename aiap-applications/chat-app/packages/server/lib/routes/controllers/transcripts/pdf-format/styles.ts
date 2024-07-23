/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const STYLES = {
  profile: {
    fontSize: 11,
    alignment: 'center',
    margin: [0, 0, 0, 10]
  },
  title: {
    fontSize: 16,
    alignment: 'center',
    bold: true,
    margin: [0, 0, 0, 50]
  },
  sender: {
    fontSize: 13,
    bold: true,
    margin: [0, 0, 0,5]
  },
  text: {
    fontSize: 12,
    normal: true,
    margin: [0, 0, 0, 5]
  },
  time: {
    fontSize: 10,
    margin: [0, 0, 0, 10]
  },
  link: {
    fontSize: 12,
    bold: true,
    color: 'blue'
  },
  table: {
    margin: [0, 0, 0, 5]
  }
};

const VALID_STYLES = {
  SENDER: 'sender',
  TEXT: 'text',
  TIME: 'time',
  PROFILE: 'profile',
  TITLE: 'title',
  LINK: 'link',
  TABLE: 'table'
};

const DEFAULT_STYLE = {
  columnGap: 20,
  font: 'IBMPlexSans'
};

export {
  STYLES,
  VALID_STYLES,
  DEFAULT_STYLE,
};
