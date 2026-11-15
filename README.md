# zellij.dev
The website for zellij

Requires [Hugo](https://gohugo.io/installation/) and [Dart Sass](https://sass-lang.com/install/) on your `PATH`; Hugo uses Dart Sass to compile the theme's SCSS. CI uses the versions pinned in `.github/workflows/gh-pages.yml`.

To run: `hugo server`

To watch-build documentation: `mdbook watch docs/ -d ../static/documentation`

For both, run: `./watch-serve.sh`
