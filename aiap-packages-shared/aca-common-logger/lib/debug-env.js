/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
let status = {};

exports.update = (level, patterns) => {
  exports.parse(level, patterns || '');
};

exports.parse = (level, patterns) => {
  status[level] = { names: [], skips: [] };
  patterns.split(/[\s,]+/).forEach(pattern => {
    exports.add(level, pattern);
  });
};

exports.enabled = (level, name) => {
  const skipped = status[level].skips.some(re => re.test(name));
  if (skipped) return false;

  return status[level].names.some(re => re.test(name));
};

exports.add = (level, pattern, enabled) => {
  pattern = pattern.replace(/\*/g, '.*?');

  if (enabled === undefined) {
    if (pattern[0] === '-') {
      enabled = false;
      pattern = pattern.substr(1);
    } else {
      enabled = true;
    }
  }
  const regex = new RegExp('^' + pattern + '$');

  status[level].skips = status[level].skips.filter(v => v.toString() !== regex.toString());
  status[level].names = status[level].names.filter(v => v.toString() !== regex.toString());
  (enabled ? status[level].names : status[level].skips).push(regex);
};
