const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass')); //funciona para as versões mais recentes do gulp
//É necessário colocar npm update e npm install gulp-sass --save-dev para funcionar
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();

function scssTask(){
    return src('scss/**/*.scss', { sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('./dist/css', { sourcemaps: '.' }));
}

//JavaScript Task
function jsTask(){
    return src('js/**/*.js', { sourcemaps: true})
		.pipe(uglify())
		.pipe(concat("bundle.js"))
		.pipe(dest("./dist/"));
}

//Browsersync Tasks
function browsersyncServe(cb){
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
   browsersync.reload();
   cb();
}

//Watch Task
function watchTask(){
    watch('*.html', browsersyncReload);
    watch(['scss/**/*.scss', 'js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

//Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServe,
    watchTask
);

