# zellij.dev
The website for zellij

Requires [Hugo](https://gohugo.io/installation/), and [mdBook](https://rust-lang.github.io/mdBook/guide/installation.html) for the docs. CI uses the versions pinned in `.github/workflows/gh-pages.yml`.

To run: `hugo server`

To watch-build documentation: `mdbook watch docs/ --dest-dir ../static/documentation`

For both, run: `./watch-serve.sh`
