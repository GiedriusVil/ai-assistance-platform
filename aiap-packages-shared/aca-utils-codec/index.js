/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const {
  ACA_CODEC_DECODE_TYPES,
  ACA_CODEC_ENCODE_TYPES,
} = require('./lib/types');

const {
  decode,
  decodeObjectBase64Attribute,
  fromBase64ToString,
} = require('./lib/decode');

const {
  encode,
} = require('./lib/encode');

module.exports = {
  ACA_CODEC_DECODE_TYPES, ACA_CODEC_ENCODE_TYPES,
  decode,
  decodeObjectBase64Attribute,
  fromBase64ToString,
  encode,
}
