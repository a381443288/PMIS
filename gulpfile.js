var gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug'),
    cssmin = require('gulp-cssmin'),
    babel = require('gulp-babel'),
    // postcss = require('gulp-postcss'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include'),
    changedInPlace = require('gulp-changed-in-place'),
    uglify = require('gulp-uglify'), //js压缩
    jshint = require('gulp-jshint'), //js检测
    autoprefixer = require('gulp-autoprefixer');
//var plugins = require('gulp-load-plugins')();
//var webpack = require('gulp-webpack');
//var webpackConf = require('./webpack.config.js');
var browserSync = require('browser-sync').create();
var basepath = 'src/';
var bulidpath = 'dist';
var jspath = 'dist/static2.0/js/';

//用于在html文件中直接include文件
gulp.task('fileinclude', function() {
    gulp.src([basepath + '**/*.html'])
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(debug({ title: '编译:' }))
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(bulidpath))
        .pipe(browserSync.reload({ stream: true }));
});

//用于在html文件中直接include文件
gulp.task('changedhtml', function() {
    gulp.src([basepath + '**/*.html'])
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(debug({ title: '编译:' }))
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(bulidpath))
        .pipe(browserSync.reload({ stream: true }));
});

//拷贝文件
gulp.task('copy', function() {
    gulp.src([basepath + '**/{images,video}/**' , basepath + '**/font-awesome/fonts/**' , basepath +'**/*.min.js' ,basepath + '**/js/layer/**',basepath + '**/js/jquery-select2/**'], { base: basepath })
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(debug({ title: '编译:' }))
        .pipe(plumber())
        .pipe(gulp.dest(bulidpath))
});

//编译CSS和SASS
gulp.task('scssmin', function() {
    gulp.src([basepath + '**/*.{scss,css}', '!'+basepath + '**/_*.scss'])
        //.pipe(changedInPlace({ firstPass: true }))
        //.pipe(changed('*/WebRoot/**',{extension:'.css'})) // 只有被更改过的文件才会通过这里
        .pipe(debug({ title: '编译:' }))
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compact' //调试
            //outputStyle: 'compressed'   //压缩发布
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["Firefox >= 15", "iOS > 5", "ie > 8", "last 2 Chrome versions"]
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(bulidpath))
        .pipe(browserSync.reload({ stream: true }));
});

//合并JS
gulp.task("composite",function(){
    gulp.src([basepath + '**/jquery.min.js',basepath + '**/select2.min.js'])
        .pipe(debug({ title: '编译:' }))
        .pipe(concat('pmis.jquery.js'))
        .pipe(gulp.dest(jspath + 'jquery'));
})
//压缩js
gulp.task('jsmin', function() {
    gulp.src([basepath + '**/js/**/*.js', '!' + basepath + '**/js/**/*min.js'])
        // 只有被更改过的文件才会通过这里
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(debug({ title: '编译:' }))
        .pipe(plumber())
        .pipe(babel())  //ES6转成ES5
        .on('error', console.error.bind(console))
        .pipe(jshint())
        .on('error', console.error.bind(console))
        .pipe(jshint.reporter('jshint-stylish')) // 对代码进行报错提示
        //.pipe(uglify())  //压缩
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(bulidpath))
        .pipe(browserSync.reload({ stream: true }))
});

//删除dist文件
gulp.task('clean', function(done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done)
});

//本地服务器
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: bulidpath
        }
    });
    gulp.watch([basepath + '**/*.html'], ['fileinclude']);
    gulp.watch([basepath + '**/*.inc'], ['changedhtml']);
    gulp.watch([basepath + '**/*.{scss,css}'], ['scssmin']);
    gulp.watch([basepath + '**/js/**/*.js'], ['jsmin']);
    gulp.watch([basepath + '**/{images,video}/**' , basepath +'**/*.min.js'], ['copy']);
});

gulp.task('dev', ['copy', 'fileinclude', 'scssmin', 'jsmin', 'watch','composite']);
gulp.task('js', ['jsmin', 'watch']);
