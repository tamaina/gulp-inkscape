const { spawn, execSync } = require("child_process")
const temp = require("temp")
const through2 = require("through2")
const fs = require("fs")

module.exports = (option) => {
  temp.track()
  let nargs = []
  if (option.args) {
    if (typeof option.args === "string") nargs = nargs.concat(option.args.split(" "))
    else if (Array.isArray(option.args)) nargs = nargs.concat(option.args)
    else throw Error("maqz:inkscape: 'args' should be a string or an array.")
  }

  let cwd
  try {
    execSync("inkscape --version")
  } catch (e) {
    try {
      execSync(String.raw`"c:\Program Files\Inkscape\inkscape" --version`)
      cwd = String.raw`c:\Program Files\Inkscape`
    } catch (f) {
      throw Error("Inkscape doesn't exist")
    }
  }
  console.log(cwd)

  return through2.obj(
    // eslint-disable-next-line consistent-return
    (nfile, encode, cb) => {
      const file = nfile.clone()
      if (!file || file.isNull()) {
        return cb(null, nfile)
      }
      if (file.isBuffer()) {
        temp.open({ suffix: ".svg" }, (err, info) => {
          if (err) cb(new Error("maqz:inkscape(temp-open)", err))
          fs.write(info.fd, file.contents, () => null)
          fs.close(info.fd, (err2) => {
            if (err2) cb(new Error("maqz:inkscape(temp-write)", err2))
            const dois = spawn(
              "inkscape",
              nargs.concat(["-z", "-f", info.path, `--export-${option.exportType || "plain-svg"}=-`]),
              { cwd }
              )
            const res = []
            dois.stdout.on("data", (chunk) => {
              res.push(chunk)
            })
            dois.stderr.on("data", (data) => {
              throw Error(`maqz:inkscape:\n${data.toString()}`)
            })
            dois.on("close", () => {
              file.contents = Buffer.concat(res)
              cb(null, file)
            })
            dois.stdin.end()
          })
        })
      } else if (file.isStream()) {
        temp.track()
        temp.open({ suffix: ".svg" }, (err, info) => {
          if (err) cb(new Error("maqz:inkscape(temp-open)", err))
          fs.write(info.fd, file.contents, () => null)
          fs.close(info.fd, (err2) => {
            if (err2) cb(new Error("maqz:inkscape(temp-write)", err2))
            const dois = spawn(
              "inkscape",
              nargs.concat(["-z", "-f", info.path, `--export-${option.exportType || "plain-svg"}=-`]),
              { cwd }
              )
            dois.stderr.on("data", (data) => {
              throw Error(`maqz:inkscape:\n${data.toString()}`)
            })
            dois.on("close", () => {
              cb(null, file)
            })
            dois.stdout.pipe(file.contents)
          })
        })
      }
    }
  )
}
