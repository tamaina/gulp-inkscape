const gulp = require("gulp")
const minimist = require("minimist")
const inkscape = require("./index")
const argv = minimist(process.argv.slice(2))

gulp.task("default", cb => {
  if (!argv.i) throw Error("ファイル/フォルダ名が指定されていません。 -i <path>を付けて指定してください。")
  gulp.src(argv.i)
    .pipe(inkscape({}))
    .pipe(gulp.dest("test/"))
    .on("end", cb)
    .on("error", cb)
})
