gulp.task('0default', function() {
    console.log("just chillin");
});
gulp.task('default',['0default'], function() {
    console.log("hello world");
});