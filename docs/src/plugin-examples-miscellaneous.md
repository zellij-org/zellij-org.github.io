# Miscellaneous plugins

### [jbz](https://github.com/nim65s/jbz)
![jbz preview](/video/jbz-preview.gif)

[jbz](https://github.com/nim65s/jbz) simply spawn all your [just](https://github.com/casey/just) commands wrapped
in [bacon](https://github.com/Canop/bacon), each one in a new pane.

### [Monocle](https://github.com/imsnif/monocle)
![Monocle preview](/video/monocle-preview.gif)

[Monocle](https://github.com/imsnif/monocle) is a fuzzy finder for file names and their contents.

#### It can
- Open results in your `$EDITOR` (scrolled to the correct line), as floating or tiled panes.
- Open a new terminal pane to the location of the file, as a floating or tiled pane.
- Ignore hidden files and respect your `.gitignore`.

If you press `ESC` or `Ctrl c`, it will hide itself until you call it again.

### [Multitask](https://github.com/imsnif/multitask)

![multitask plugin preview](/img/multitask-preview.png)

This Zellij plugin is a "mini-ci". It allows you to specify commands that will run in parallel, keeping track of completed commands and their exit status. Only progressing to the next step if all the commands in the previous step succeeded.

Did one command fail? No problem! Fix the issue, re-run it with ENTER and the pipeline will continue.
