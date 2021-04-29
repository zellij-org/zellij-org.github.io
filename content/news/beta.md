---
author: "Aram Drevekenin"
authorlink: "https://twitter.com/im_snif"
date: 2021-04-20
linktitle: "Zellij: a Rusty terminal workspace releases a beta"
type:
- post
- posts
title: "Zellij: a Rusty terminal workspace releases a beta"
images: ["/img/beta-post-preview.png"]
description: "After long months of work by a dedicated team of enthusiasts, today we are proud to announce the release of the beta version of Zellij"
weight: 10
---

After long months of work by a dedicated team of enthusiasts, today we are proud to announce the release of the beta version of [Zellij](https://github.com/zellij-org/zellij)!

[Zellij](https://github.com/zellij-org/zellij) is a terminal workspace and multiplexer written in Rust, aiming to become a general purpose application development platform in the future.

{{<figure src="/img/zellij-preview-animated.gif" class="center">}}

## How to install?

Download a prebuilt binary for [linux](
https://github.com/zellij-org/zellij/releases/latest/download/zellij-x86_64-unknown-linux-musl.tar.gz) or [macOS](https://github.com/zellij-org/zellij/releases/latest/download/zellij-x86_64-apple-darwin.tar.gz).


Or install with cargo:
```
cargo install zellij
```

## Why is Zellij different?
Zellij is constantly evolving, and even in this early stage it still shines. Including the basic features of a terminal multiplexer with some fundamental infrastructure changes, as well as some extra goodies included from the get-go.

### User friendly UI out of the box

One of the guiding principles in creating Zellij is that it should be as user friendly as possible.
We believe no one should have to memorize keyboard shortcuts or overly configure their interface in order to be comfortable.
While Zellij is highly configurable in both these regards, its default interface and keybindings allow new users to simply begin working.

### Built in layouts

Do you find yourself re-creating the same pane layout every time? Zellij comes with a layout engine that allows you to create yaml files to describe that layout.

 A simple `zellij --layout /path/to/your/layout.yaml` should save you that time.

{{<figure src="/img/beta-post-layout.png" class="center">}}

### WebAssembly plugin system

Zellij is built with extendability in mind.

One can extend Zellij, creating pane types beyond a simple terminal. This can be done with [any language that compiles to WebAssembly](https://github.com/appcypher/awesome-wasm-langs). For examples and API documentation, see the [plugin documentation](/documentation/plugins.html)

{{<figure src="/img/beta-post-plugins.png" class="center">}}

### Improved resizing algorithm
One of the main multiplexer-specific innovations in Zellij is the algorithm it uses to arrange and resize panes.
Zellij includes a "new pane" command that doesn't force you to think about vertical or horizontal splits, but rather looks for the best place on screen to open the pane for you. (See the UI for more info).

Zellij also allows a great deal of freedom when resizing panes. Users of other multiplexers would likely be familiar with the following situation, where one cannot resize a single pane both horizontally and vertically without dragging other panes with it:

{{<figure src="/img/beta-post-resize-multiplexers.png" class="center">}}

With Zellij, there is no such limitation:

{{<figure src="/img/beta-post-resize-zellij.png" class="center">}}

## Stability

This beta release marks Zellij as stable for every day use. While some bugs may pop up here and there, they should be the very edge of edge cases. If you find them, we would very much appreciate an issue report!

## What's next?
The team behind Zellij is still hard at work improving the tool. Some key improvements we're working on right now:
* Allow detaching active sessions and resuming them at a later time.
* Allow sharing sessions with other users over the network.
* Build a web client to allow users to connect to a running Zellij daemon through the browser (on a local or remote server).
