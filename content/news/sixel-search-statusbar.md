---
author: "Aram Drevekenin"
authorlink: "https://twitter.com/im_snif"
date: 2022-07-29
linktitle: "Zellij 0.31.0: Sixel support, search panes and custom status-bar keybindings"
type:
- post
- posts
title: "Zellij 0.31.0: Sixel support, search panes and custom status-bar keybindings"
images: ["/img/floating-panes-preview.png"]
description: "We just released a significant version of Zellij with lots of highly anticipated features!"
alttext: "An image of the Zellij terminal multiplexer"
weight: 10
---

[Zellij 0.31.0](https://github.com/zellij-org/zellij/releases/tag/v0.31.0) was just released. This version includes three highly anticipated features that have each been in the works for a long while.

The new release is available through crates.io with a `cargo install zellij`, a prebuilt binary can be downloaded directly from the release page, or you can check our [third party release page](https://github.com/zellij-org/zellij/blob/main/THIRD_PARTY_INSTALL.md) to see if it's already available for your distro.

If you like, you can even try Zellij without installing it. Check out the main page for copy/pasteable instructions: [https://zellij.dev](https://zellij.dev)

Let's dive in!

### Sixel Support

{{<figure src="/img/sixel-release-preview.png" class="center">}}

[Sixel graphics](https://en.wikipedia.org/wiki/Sixel) is a DEC protocol that enables displaying images and video in the terminal. With this version, Zellij has become one of its modern implementors.
In order to take advantage of this new feature, you'll need a terminal emulator which itself has Sixel support. Here's [a nice list](https://www.reddit.com/r/linux/comments/t3m7zm/quick_roundup_of_bitmap_graphics_availability_in/).

As part of our work on this feature, we released much of the Sixel encoding/decoding logic as two separate crates: [sixel-image](https://github.com/zellij-org/sixel-image) and [sixel-tokenizer](https://github.com/zellij-org/sixel-tokenizer). We hope this will help kickstart other projects who want to do interesting things with Sixel images.

Adding Sixel support is a first step for Zellij in a long journey. In the near future, we hope to add:
1. Sixel support for unsupported terminals - so that if your terminal emulator does not have Sixel support, you'll still get a colorful ASCII representation of the image.
2. Support for image previews inside Zellij - also accessible to plugins.
3. An internal Zellij command that opens an image from your HD or the web in a new pane

For now, if you'd like to try out some Sixel apps, check out [lsix](https://github.com/hackerb9/lsix) or [chafa](https://github.com/hpjansson/chafa). There are also [plenty of others](https://github.com/libsixel/libsixel/blob/master/md/Projects%20using%20SIXEL.md)

### Search through pane scrollback
{{< video "/video/search-release-demo.mp4" >}}

This feature has been very widely requested. While like all UX features, we're sure to improve upon it in the future, we tried to make an effort to give users a search experience they know and recognize from other applications. We aim for both power and simplicity.

We replaced the old "Scroll" mode with a new "Search" mode, which includes the new search feature as well as all the scrolling shortcuts.

The search feature includes toggles for case-sensitivity, whole-word search and wraparound. This feature was a tremendous effort, contributed by [msirringhaus](https://github.com/msirringhaus) to whom we are very grateful!

### The status-bar shortcuts now reflect your custom config
{{<figure src="/img/custom-keys-status-bar-preview.png" class="center">}}
Ever since Zellij came out, it has been distinguished by its ease-of-use and feature discoverability. You don't need to read a book, keep cheat-sheets or memorize keybindings to use Zellij. You just start it and it tells you what to do in the bottom status-bar. Up until now however, this has somewhat gotten in the way of those who wanted to configure custom keybindings. The status-bar shortcuts were hard-coded, and users would get naturally confused by their changes not being displayed on screen.

Our newest maintainer, [har7an](https://github.com/har7an) has spent a colossal amount of time and effort implementing this feature. Not a small feat considering the amount of technical-debt he had to wade through in a strange code-base!

This feature not only gives users with a configured environment a better experience, but it also brings us one step closer to another goal. Imagine being able to send a custom configuration to your teammates which includes all your handy macros and shortcuts for your environment, without even having to document them.

### What else?
In addition, this version includes lots of bug fixes, some really nice performance improvements, support for a "themes" directory and much more. We hope you enjoy it, and please drop by our chats or issues to say hi!
