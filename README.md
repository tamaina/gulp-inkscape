# gulp-inkscape
## Installing
1. inkscapeをダウンロードし、パスを通します。
2. `npm i gulp-inkscape` でパッケージをインストールします。

## Usage
```
const inkscape = require("gulp-inkscape")
gulp.src("path/**/*.svg")
  .pipe(inkscape({ args: ["-T"] }))
```

### option
[inkscapeのコマンドラインのドキュメント](https://inkscape.org/ja/doc/inkscape-man.html)も併せてお読みください。

#### args
コマンドラインオプションを配列で記述します。Usageでは`-T`を指定することで、テキストをパスに変換しています。

#### exportType
デフォルトは`plain-svg`です。`--export-`の`-`のから末尾までを指定します。

## TODO
現状の優先度はかなり低いがGitHubのスターが増えたらやる可能性があること

- ストリームでの動作確認
- コマンドラインオプションを配列で記述するのではなく、オプションの値決めるようにする

## About the author
https://tamaina.github.io
