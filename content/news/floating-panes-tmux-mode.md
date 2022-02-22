---
author: "Aram Drevekenin"
authorlink: "https://twitter.com/im_snif"
date: 2022-02-22
linktitle: "Zellij 0.25.0: floating panes, tmux mode and more!"
type:
- post
- posts
title: "Zellij 0.25.0: floating panes, tmux mode and more!"
images: ["/img/floating-panes-preview.png"]
description: "The latest Zellij version introduces floating panes you can move with your mouse, a built-in tmux mode to help those migrating and much more!"
alttext: "An image of Zellij demonstrating its floating panes capabilities"
weight: 10
---

{{<figure src="/img/floating-panes-demo.gif">}}

We just released [Zellij 0.25.0](https://github.com/zellij-org/zellij/releases/tag/v0.25.0), which adds a few features we are very excited about!

The new release is already available through crates.io with a `cargo install zellij`, a prebuilt binary can be downloaded directly from the release page, or you can check our [third party release page](https://github.com/zellij-org/zellij/blob/main/THIRD_PARTY_INSTALL.md) to see if it's already available for your distro.

So what's new?

### Floating Panes
Floating panes can stack and move freely. Their visibility can be toggled on and off with `ctrl-p` + `w` (if there are no open floating panes, toggling their visibility on will open a new one).

These panes can be resized or moved like normal panes (try `Alt+` or `Alt-`), and you can even drag them around with the mouse by clicking their frame.

You can also turn an embedded pane into a floating one by focusing on it and pressing `ctrl-p` + `e`, or embed a floating pane in the same way.

### Tmux mode

Zellij has a slightly different idea about its keybindings than Tmux. This has made it difficult for Tmux users to migrate. We would like to make Tmux users comfortable and feeling at home, rather than forcing them to work against years of muscle memory.

And so starting this version, Zellij supports the basic Tmux shortcuts out of the box, without extra configuration. It even includes a helpful tip that appears once you press the initial `ctrl-b`

{{<figure src="/img/tmux-shortcuts.png">}}

### Copy directly to the system clipboard

Zellij uses the `OSC 52` escape code to copy contents to the user's clipboard. Not all terminal emulators support this though, and so this version provides a workaround. This workaround is a configuration parameter that tells Zellij to use the system clipboard directly instead.

For more information: https://zellij.dev/documentation/compatibility.html#clipboard-not-working

### [And lots more!](https://github.com/zellij-org/zellij/releases/tag/v0.25.0)
