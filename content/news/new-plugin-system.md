---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2023-06-27
linktitle: "Build Zellij WebAssembly (Rust) Plugins for your Terminal"
type:
- post
- posts
title: "Build Zellij WebAssembly (Rust) Plugins for your Terminal"
images: ["/img/zellij-plugins-diagram.png"]
description: "Wouldn't it be cool to be able to develop terminal applets like UI components?"
alttext: "A diagram of how Zellij plugins fit into the Zellij workspace"
weight: 10
---
![Zellij plugins diagram](/img/zellij-plugins-diagram.png)

Wouldn't it be cool to be able to develop terminal applets like UI components? Visual scripts to help you automate your workflow, shareable with others and written in Rust?

The [Zellij](https://github.com/zellij-org/zellij) team has just overhauled our WebAssembly plugin system, and we'd like to invite plugin developers to build this with us.

Want to participate in building something new? Don't mind a few rough edges? Please read on!

## What is a Zellij plugin?

Zellij provides plugins with the capabilities of a terminal multiplexer.

#### Plugins can:

- draw their own UI
- programmatically manage the user's workspace (panes, tabs, commands, editors), 
- be woken up by specific events (file access, keypress, command ending, etc.)
- and [much more](https://zellij.dev/documentation/plugins)

## [zellij-tile (Rust SDK)](https://docs.rs/zellij-tile/latest/zellij_tile/)
![zellij-tile diagram](/img/zellij-tile-diagram.png)

Zellij provides a Rust SDK ([zellij-tile](https://docs.rs/zellij-tile/latest/zellij_tile/)) to develop Rust plugins (other languages coming soon!)

We use lifecycle methods to control the plugin. A plugin renders itself by printing to STDOUT. As opposed to traditional terminal apps, a Zellij plugin does not need to manage its own output buffer. Instead, it can print its UI components where they need to be whenever it renders.

We also provide plugins with access to background workers to perform long running tasks such as large search queries.

## Demo Plugins

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

## What more will be possible in the near future
In the near future, once we've added a robust permission system to plugins, we plan on adding more interesting capabilities to plugins:
- render themselves in relation to the cursor
- get access to the viewport and scrollbuffer of panes
- record and replay keystrokes
- perform http/s requests
- use and adjust the built-in UI components

## How to get started
![dev.kdl development environment](/img/dev-kdl-preview.png)

We provide [an example repo](https://github.com/zellij-org/rust-plugin-example) to kick you off. You'll get:

1. A plugin you can `cargo build` and load into Zellij 
2. A Zellij [layout](https://zellij.dev/documentation/layouts) (called dev.kdl) that does all of this for you - load it with `zellij -l kdl.dev` to get started immediately
3. Live examples of some useful events, commands and UI rendering

#### Please also refer to the documentation
* [General documentation for plugins](https://zellij.dev/documentation/plugins)
* [zellij-tile, the Rust SDK](https://docs.rs/zellij-tile/latest/zellij_tile/)

## Did you build something cool or useful?
Come show us on [Discord](https://discord.gg/CrUAFH3) or [Matrix](https://matrix.to/#/#zellij_general:matrix.org).

You could also just drop by and ask questions if anything is unclear.
