// Include gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var htmltojson = require('gulp-html-to-json');
var config = require('./gulpconfig.json');

// Clean
gulp.task('clean', function () {
    return gulp.src(config.releasePath.root, { read: false }).pipe(clean());
});

gulp.task('lint', function() {
    return gulp.src(config.files.jsfiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    return gulp.src(config.files.jsfiles)
        .pipe(concat(config.fileName.js))
        .pipe(gulp.dest(config.releasePath.js))
        .pipe(uglify())
        .pipe(rename(config.fileName.jsMin))
        .pipe(gulp.dest(config.releasePath.js))
        .on('error', gutil.log);
});

gulp.task('minify-css', function() {
    return gulp.src(config.files.cssfiles)
        .pipe(concat(config.fileName.css))
        .pipe(gulp.dest(config.releasePath.css))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(rename(config.fileName.cssMin))
        .pipe(gulp.dest(config.releasePath.css))
        .on('error', gutil.log);
});

gulp.task('markdown', function() {
    return gulp.src(config.sources.tpl)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(htmltojson({
            filename: config.fileName.tpl,
            useAsVariable: true,
            isAngularTemplate: true
        }))
        .pipe(gulp.dest(config.releasePath.js))
});

gulp.task('default', function () {
    runSequence('clean', 'lint', 'scripts', 'markdown', 'minify-css');
});

gulp.task('watch', ['default'], function() {
    gulp.watch(config.files.cssfiles, ['minify-css']);
    gulp.watch(config.files.jsfiles, ['scripts']);
    gulp.watch(config.sources.templates, ['markdown']);
});