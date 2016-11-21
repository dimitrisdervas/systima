var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var sass           = require('gulp-sass');
var prefix         = require('gulp-autoprefixer');
var cp             = require('child_process');
var sourcemaps     = require('gulp-sourcemaps');
var concat         = require('gulp-concat');
var nano           = require('gulp-cssnano');
var util           = require('gulp-util');
var gulpif         = require('gulp-if');
var plumber        = require('gulp-plumber');
var uglify         = require('gulp-uglify');
var imagemin       = require('gulp-imagemin');
var pngquant       = require('imagemin-pngquant');
var fs             = require('fs');
var handlebars     = require('gulp-compile-handlebars');
var rename         = require('gulp-rename');
var baby           = require('babyparse');
var mainBowerFiles = require('gulp-main-bower-files');
var psi            = require('psi');
var htmlmin        = require('gulp-htmlmin');
var gulpFilter     = require('gulp-filter');
var critical       = require('critical');
var googleWebFonts = require('gulp-google-webfonts');
var stripComments  = require('gulp-strip-comments');
var responsive    = require('gulp-responsive');
var responsiveConfig    = require('gulp-responsive-config');


var postcss        = require('gulp-postcss');
var autoprefixer   = require('autoprefixer');
var pxtorem        = require('postcss-pxtorem');
var orderedValues  = require('postcss-ordered-values');
var colorHexAlpha  = require("postcss-color-hex-alpha");
var responsiveType = require("postcss-responsive-type");
var debug          = require('postcss-debug').createDebugger();

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
    bowerDir: '_resources/bower/bower.json',
    sassPattern: 'sass/**/*.scss',
    jsPattern: 'js/**/*.js',
    production: !!util.env.production,
    sourceMaps: !util.env.production };

/**
 * Utils object
 */
var app = {};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build', ''], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['removeHtmlComments'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['removeHtmlComments'], function() {
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
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),
    pxtorem({replace: false,selectorBlackList: ['btn-floating']}),
    colorHexAlpha(),
    responsiveType(),
  ];
   return gulp.src(config.assetsDir+'/sass/styles.scss')
        .pipe(plumber())
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(postcss(debug(processors)))
        .pipe(concat('styles.css'))
        .pipe(config.production ? nano() : util.noop())
        .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));

});

gulp.task('css-debug', ['styles'], function () {
  debug.inspect()
})


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
    gulp.watch(['*.html',
                '_includes/**/*',
                '_data/**/*',
                '_layouts/*.html',
                '_success/*',
                '_news/*',
                '_studies/*',
                '_sxoles/*',
                '_leitourgia/*',
                '_frontistiria/*',
                '_sxoles/*',
                '_articles/*',
                'pages/**/*',
                '_other/*'],
                ['jekyll-rebuild']);
});


// WATCH ONLY SASS STYLES
gulp.task('watch-only-styles', function () {
  gulp.watch(config.assetsDir+'/sass/*.scss', ['styles']);
});


gulp.task('watch-styles', ['browser-sync', 'watch-only-styles']);


/*
* Critical CSS
*/
gulp.task('critical', function () {
    critical.generate({
        base: './',
        src: '_site/index.html',
        css: '_site/assets/css/styles.css',
        dest: '_includes/css/critical.css',
        width: 320,
        height: 480,
        minify: true
    });
});


/**
 * Default task, running just gulp will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

/**
 * Util functions
 */
// app.addStyle = function(paths, outputFilename){
//     gulp.src(paths)
//         .pipe(plumber())
//         .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
//         .pipe(sass({
//             includePaths: ['scss'],
//             onError: browserSync.notify
//         }))
//         .pipe(
//         autoprefixer({
//             browsers: 'last 1 version'
//         }),
//         pxtorem({
//             replace: false
//         }))
//         .pipe(concat(outputFilename))
//         .pipe(config.production ? nano() : util.noop())
//         .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
//         .pipe(gulp.dest('_site/assets/css'))
//         .pipe(browserSync.reload({stream:true}))
//         .pipe(gulp.dest('assets/css'));
// };

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
//
// PAGE SPEED INSIGHTS - GOOGLE
//
var site = 'http://91f389ef.ngrok.io';
var key = '';
// Please feel free to use the nokey option to try out PageSpeed
// Insights as part of your build process. For more frequent use,
// we recommend registering for your own API key. For more info:
// https://developers.google.com/speed/docs/insights/v2/getting-started

gulp.task('mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});
//
// HTML MINIFY not working
//
gulp.task('minify', function() {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('_site'))
});


gulp.task('main-bower-files-js', function(){
    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./_resources/bower/bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('main-bower-files-css', function(){
    var filterJS = gulpFilter('**/*.css', { restore: true });
    return gulp.src('./_resources/bower/bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(filterJS)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('main-bower-files-sass', function(){
    var filterJS = gulpFilter('**/sass/**', { restore: true });
    return gulp.src('./_resources/bower/bower_components/')
        .pipe(filterJS)
        .pipe(filterJS.restore) 
        .pipe(gulp.dest('_resources/sass/vendor'));
});


// fonts
/**
 * Compile fonts
 */
gulp.task('fonts', function () {
    var options = {
    fontsDir: 'googlefonts/',
    cssDir: 'googlecss/',
    cssFilename: 'myGoogleFonts.scss'
    };

    return gulp.src('_resources/sass/fonts/fonts.list')
    .pipe(googleWebFonts(options))
    .pipe(gulp.dest('_resources/sass/fonts'))
    .pipe(gulp.dest('assets/css/fonts'))
    ;
});


gulp.task('removeHtmlComments',['styles','jekyll-build'], function () {
  return gulp.src('_site/**/*.html')
    .pipe(stripComments())
    .pipe(gulp.dest('_site'));
});



gulp.task('maincss', function() {
  return gulp.src(['assets/css/styles.css','assets/css/vendor.css'])
    .pipe(concat('main.css'))
    .pipe(nano())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('images', function () {
  // Make configuration from existing HTML and CSS files
  var config = responsiveConfig([
    '_site/**/*.css',
    '_site/**/*.html'
  ]);
  return gulp.src('assets/images/systima-images/*.{png,jpg}')
    // Use configuration
    .pipe(responsive({
      '*.jpg': [{
        width: 100,
        height: 100,
        grayscale: true,
        rename: { dirname: '200px' },
      }, {
        width: 500,
        rename: { dirname: '500px' },
      }, {
        width: 630,
        rename: { dirname: '600px' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { dirname: 'original' },
      }],
    },{
      errorOnEnlargement: false,
      quality: 80,
      withMetadata: false,
      compressionLevel: 7,
    }))
    .pipe(gulp.dest('assets/images/systima-images'));
});