var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var prefix       = require('gulp-autoprefixer');
var cp           = require('child_process');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var nano         = require('gulp-cssnano');
var util         = require('gulp-util');
var gulpif       = require('gulp-if');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var fs           = require('fs');
var handlebars   = require('gulp-compile-handlebars');
var rename       = require('gulp-rename');
var baby         = require('babyparse');
var mainBowerFiles = require('gulp-main-bower-files');


// 
// ACHILEAS
// 
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
/**
 * Store paths
 */
var config = {
    assetsDir: '_resources',
    bowerDir: 'vendor/bower_components',
    sassPattern: 'sass/**/*.scss',
    jsPattern: 'js/**/*.js',
    production: !!util.env.production,
    sourceMaps: !util.env.production,};

/**
 * Utils object
 */
var app = {};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build', '--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['styles','fonts','images','jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _resources/_scss into both [project-folder]/_site/css (for live injecting) and [project-folder]/css (for future jekyll builds)
 */
gulp.task('styles', function () {
    app.addStyle([
        //config.bowerDir+'/font-awesome/css/font-awesome.css',
        config.assetsDir+'/sass/styles.scss'
    ], 'styles.css');
});


/**
 * Compile fonts
 */

gulp.task('fonts', function() {
    app.copy(
        'fonts',
        'fonts'
    );
});

/**
 * Image optimization
 */
gulp.task('images', function() {
    gulp.src(config.assetsDir+'/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('_site/images'))
        .pipe(gulp.dest('images'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(config.assetsDir+'/sass/**/*.scss', ['styles']);
    gulp.watch(config.assetsDir+'/js/**/*.js', ['scripts']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*','_other/*'], ['jekyll-rebuild']);
});

// WATCH ONLY SASS STYLES
gulp.task('watch-only-styles', function () {
  gulp.watch(config.assetsDir+'/sass/*.scss', ['styles']);
});

gulp.task('watch-styles', ['browser-sync', 'watch-only-styles']);


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);


/**
 * Util functions
 */
app.addStyle = function(paths, outputFilename){
    gulp.src(paths)
        .pipe(plumber())
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix())
        .pipe(concat(outputFilename))
        .pipe(config.production ? nano() : util.noop())
        .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
};

app.addScripts = function(paths, outputFilename){
    gulp.src(paths)
        .pipe(plumber())
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(concat(outputFilename))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('_site/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('js'));
};

app.copy = function(srcFiles, outputDir) {
    gulp.src(srcFiles)
        .pipe(gulp.dest(outputDir))
    ;
};