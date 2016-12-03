var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;
    
var paths = {
    allFiles : "./**/*"
};

gulp.task('show-node-info', function(done) {
    console.log(process);
    console.log(process.env);
    console.log(process.env.NODE_ENV);
});

gulp.task('reload:onchange', function(done) {
    
    browserSync.init({
        proxy: "localhost:8080"
    });

    gulp.watch(paths.allFiles).on('change', reload);
});