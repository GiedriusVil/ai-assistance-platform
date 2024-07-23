const { series, src, dest, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-csso');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const fs = require('fs-extra');

const clean_dist = () => {
  return del(['build']);
};

const build_sass = () => {
  return src('./src/widget.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(replace(/'/g, '\"'))
    .pipe(dest('build'));
};

const build_html = () => {
  return src('./src/widget.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, quoteCharacter: '"' }))
    .pipe(replace(/'/g, '\"'))
    .pipe(dest('build'));
};

const build_widget = () => {
  return src('./src/widget.js')
    .pipe(replace('_WIDGETSCSS_', fs.readFileSync('./build/widget.css', 'utf8')))
    .pipe(replace('_WIDGETHTML_', fs.readFileSync('./build/widget.html', 'utf8')))
    .pipe(uglify({ output: { quote_style: 1 } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../client/dist/client-widget'));
};

const build_wbc_widget = () => {
  return src('./src/wbc-widget.js')
    .pipe(replace('_WIDGETSCSS_', fs.readFileSync('./build/widget.css', 'utf8')))
    .pipe(replace('_WIDGETHTML_', fs.readFileSync('./build/widget.html', 'utf8')))
    .pipe(uglify({ output: { quote_style: 1 } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../client/dist/client-widget'));
};

const build_wbc_button = () => {
  return src('./src/wbc-widget-button.js')
    .pipe(replace('_WIDGETSCSS_', fs.readFileSync('./build/widget.css', 'utf8')))
    .pipe(replace('_WIDGETHTML_', fs.readFileSync('./build/widget.html', 'utf8')))
    .pipe(uglify({ output: { quote_style: 1 } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../client/dist/client-widget'));
};

const build_deprecated = () => {
  return src('./src/deprecated.js')
    .pipe(uglify({ output: { quote_style: 1 } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../client/dist/client-widget'));
};

const minify_js = () => {
  return src(['./src/*.js', '!./src/widget.js', '!./src/custom.widget.js'])
    .pipe(uglify({ output: { quote_style: 1 } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('../client/dist/client-widget'));
};

const watch_task = () => {
  watch('./src/*.*', all_tasks);
};

const all_tasks = series(clean_dist, build_sass, build_html, build_widget, build_wbc_widget, build_wbc_button, build_deprecated, minify_js, clean_dist);

exports.build = all_tasks;
exports.watch = watch_task;
exports.default = all_tasks;
