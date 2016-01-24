/**
 * Created by Thram on 10/11/15.
 *
 * Enjoy!
 */

'use strict';

var browserify  = require('browserify'),
    browserSync = require('browser-sync'),
    gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    htmlreplace = require('gulp-html-replace'),
    del         = require('del'),
    gulpif      = require('gulp-if'),
    argv        = require('yargs').argv,
    fileInclude = require('gulp-file-include'),
    nodemon     = require('gulp-nodemon'),
    jshint      = require('gulp-jshint'),
    sync        = require('gulp-sync')(gulp),
    sass        = require('gulp-sass'),
    imagemin    = require('gulp-imagemin'),
    apidoc      = require('gulp-apidoc'),
    karma       = require('karma').Server;

var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

var tasks = {
  client: {
    clean       : function (cb) {
      return del([config.paths.public + '/*.{js,css,html}', config.paths.public + '/assets'], cb);
    },
    // Layouts
    layouts     : function () {
      return gulp.src(config.paths.client + '/layouts/index.html')
        .pipe(fileInclude({
          template: '<script type="text/template" id="@filename"> @content </script>'
        }))
        .pipe(htmlreplace({
          'css'   : 'css/styles.min.css',
          'vendor': 'js/vendor.min.js',
          'js'    : 'js/bundle.min.js'
        }))
        .pipe(gulp.dest(config.paths.public));
    },
    // Scripts
    scripts     : function () {
      // set up the browserify instance on a task basis
      var b = browserify({
        entries: config.paths.client + '/scripts/app.js',
        debug  : !(argv.r || argv.release)
      });

      return b.bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpif(!(argv.r || argv.release), sourcemaps.init({loadMaps: true})))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulpif(!(argv.r || argv.release), sourcemaps.write()))
        .pipe(gulp.dest(config.paths.public + '/js/'));
    },
    vendor      : function () {
      return gulp.src(config.paths.client + '/scripts/vendor/**/*.js')
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(config.paths.public + '/js/'))
    },
    // Lint Task
    lint        : function () {
      return gulp.src([config.paths.client + '/scripts/**/*.js',
          '!' + config.paths.client + '/scripts/vendor/**/*.js'])
        .pipe(jshint({expr: true}))
        .pipe(jshint.reporter('jshint-stylish'));
    },
    // Stylesheets
    stylesheets : function () {
      return gulp.src(config.paths.client + '/stylesheets/app.scss')
        .pipe(gulpif(!(argv.r || argv.release), sourcemaps.init({loadMaps: true})))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('styles.min.css'))
        .pipe(gulpif(!(argv.r || argv.release), sourcemaps.write()))
        .pipe(gulp.dest(config.paths.public + '/css/'));
    },
    // Optimize Images
    optimize    : function () {
      return gulp.src(config.paths.client + '/assets/**/*.{gif,jpg,png,svg}')
        .pipe(imagemin({
          progressive      : true,
          svgoPlugins      : [{removeViewBox: false}],
          // png optimization
          optimizationLevel: argv.r || argv.release ? 3 : 1
        }))
        .pipe(gulp.dest(config.paths.public + '/assets/'));
    },
    // Tests with Jasmine
    test        : function (done) {
      return karma.start({
        configFile: __dirname + '/client/config/karma.conf.js',
        singleRun : !(argv.w || argv.watch)
      }, function (res) {
        done();
      });
    },
    browser_sync: function () {
      browserSync.init(null, {
        proxy  : "http://localhost:" + config.server.port,
        files  : ["public/**/*.*"],
        browser: "google chrome",
        port   : 7000
      });
    }
  },
  server: {
    // Lint Task
    lint : function () {
      return gulp.src([config.paths.server + '/controllers/**/*.js'])
        .pipe(jshint({expr: true}))
        .pipe(jshint.reporter('jshint-stylish'));
    },
    // Tests with Jasmine
    test : function (done) {
      return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun : !(argv.w || argv.watch)
      }, function (res) {
        console.log(res);
        done();
      });
    },
    start: function (cb) {
      var started = false;
      nodemon({
        script: 'server.js'
      })
        .on('start', function () {
          if (!started) {
            cb();
            console.log('restarted!');
            started = true;
          }
        })
    },
    docs : function (done) {
      apidoc({
        src           : "./server",
        dest          : config.paths.docs,
        debug         : true,
        includeFilters: [".*\\.js$"]
      }, function () {
        done();
      });
    }
  },

  // Watchers
  watch: function () {
    var src  = {
      layouts    : config.paths.client + '/layouts/**/*.html',
      stylesheets: config.paths.client + '/stylesheets/**/*.scss',
      scripts    : config.paths.client + '/scripts/**/*.js'
    };
    var dist = {
      html: config.paths.public + '/index.html',
      css : config.paths.public + '/css/styles.min.css',
      js  : config.paths.public + '/js/bundle.min.js'
    };

    gulp.watch([src.layouts], ['layouts']);
    gulp.watch([src.scripts], ['lint', 'scripts']);
    gulp.watch([src.stylesheets], ['stylesheets']);
    gulp.watch([dist.html, dist.js]).on('change', browserSync.reload);
  }

};

gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    script: 'app.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

// Register Tasks
gulp.task('clean', tasks.client.clean);
gulp.task('layouts', tasks.client.layouts);
gulp.task('scripts', tasks.client.scripts);
gulp.task('lint_client', tasks.client.lint);
gulp.task('lint_server', tasks.server.lint);
gulp.task('stylesheets', tasks.client.stylesheets);
gulp.task('optimize', tasks.client.optimize);
gulp.task('test_client', tasks.client.test);
gulp.task('test_server', tasks.server.test);
gulp.task('watch', tasks.watch);
gulp.task('vendor', tasks.vendor);
gulp.task('docs', tasks.server.docs);
gulp.task('start_server', tasks.server.start);
gulp.task('browser_sync', tasks.client.browser_sync);

gulp.task('client', sync.sync(['stylesheets', 'optimize', 'lint_client', 'vendor', 'scripts', 'layouts']));
gulp.task('server', sync.sync(['lint_server', 'test_server', 'docs', 'start_server']));

// Build tasks
gulp.task('default', sync.sync(['clean', 'client', 'server']));
gulp.task('live', sync.sync(['clean', 'client', 'server', 'browser_sync', 'watch']));
