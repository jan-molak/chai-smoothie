'use strict';

const gulp      = require('gulp'),
    clean       = require('gulp-clean'),
    tslint      = require("gulp-tslint"),
    ts          = require('gulp-typescript'),
    merge       = require('merge2'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    mocha       = require('gulp-mocha'),
    path        = require('path'),
    project     = ts.createProject('tsconfig.json'),
    remap       = require('remap-istanbul/lib/gulpRemapIstanbul'),
    dirs        = require('./gulpfile.config');


gulp.task('clean', () => gulp.src([dirs.staging.all, dirs.export], { read: false }).pipe(clean()));

gulp.task("lint", () =>
    gulp.src([ dirs.src, dirs.spec, '!**/*.d.ts' ])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

gulp.task('transpile', () => {
    let transpiled = gulp.src([ dirs.src, dirs.spec, dirs.typings ])
        .pipe(sourcemaps.init())
        .pipe(ts(project, { sortOutput: true, typescript: require('typescript') }));

    return merge([
        transpiled.dts
            .pipe(gulp.dest(dirs.staging.traspiled.all)),
        transpiled.js
            .pipe(sourcemaps.write('.', { sourceRoot: '.', includeContent: false }))
            .pipe(gulp.dest(dirs.staging.traspiled.all))
    ]);
});

gulp.task('aggregate', () =>
    gulp.src(path.join(dirs.staging.reports.coverage, 'coverage-final.json'))
        .pipe(remap({
            basePath: '.',
            useAbsolutePaths: true,
            reports: {'json': path.join(dirs.staging.reports.coverage, 'coverage-final-remapped.json')}
        }))
);

gulp.task('package', () =>
    gulp
        .src(dirs.staging.traspiled.export)
        .pipe(gulp.dest(dirs.export))
);
