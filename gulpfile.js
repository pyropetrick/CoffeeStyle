const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sync = require('browser-sync').create();
const minJs = require('gulp-uglify-es').default;
const autoprefix = require('gulp-autoprefixer');
const imageMin = require('gulp-imagemin');
const del = require('del');
const htmlMin = require('gulp-htmlmin');

function clearDist() {
  return del('dist')
}

function html() {
  return src('src/**.html')
  .pipe(htmlMin({
    collapseWhitespace: true
  }))
  .pipe(dest('dist'))
}

function images() {
  return src('src/images/**/*')
  .pipe(imageMin([
    imageMin.gifsicle({interlaced: true}),
    imageMin.mozjpeg({quality: 75, progressive: true}),
    imageMin.optipng({optimizationLevel: 5}),
    imageMin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(dest('dist/images'))
}

function browserSync() {
  sync.init({
    server: {
      baseDir: "src/"
    }
  })
}

function scripts() {
  return src([ 
    "src/js/main.js"
  ])
  .pipe(concat('main.min.js'))
  .pipe(minJs())
  .pipe(dest('src/js'))
  .pipe(sync.stream())
}

function scss() {
  return src('src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefix({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(concat('main.min.css'))
    .pipe(dest('src/styles/'))
    .pipe(sync.stream())
}

function watching() {
  watch(['src/scss/**/*.scss'], scss)
  watch(['src/js/**/*.js','!app/js/main.min.js'], scripts)
  watch(['src/**.html']).on('change',sync.reload)
}

function build() {
  return src([
    'src/css/style.min.css',
    'src/fonts/**/*',
    'src/js/main.min.js',
  ], {base: 'src'})
    .pipe(dest('dist'))
}

exports.scss = scss;
exports.watching = watching;
exports.browserSync = browserSync;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.clearDist = clearDist;
exports.default = parallel(html, scss, scripts,browserSync, watching);  
exports.build = series(clearDist,html,images, build);
