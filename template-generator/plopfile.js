module.exports = async function (plop) {
  //wrap some text block in this helper to keep it as is
  //usage:
  //{{{{raw-helper}}}} some thing you {{dont}} want to change {{{{/raw-helper}}}}
  //useful when you have {{}} in code, which would be recognised as a variable to replace
  plop.addHelper('raw-helper', (options) => {
    return options.fn();
  });

  await plop.load([
    './.plop-generators/wbc-generator.js',
    './.plop-generators/application-generator.js'
  ]);
};
