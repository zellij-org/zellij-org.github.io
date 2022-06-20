---
author: "Aram Drevekenin"
authorlink: "https://twitter.com/im_snif"
date: 2022-06-08
linktitle: "Zellij 0.30.0: use your $EDITOR to search and save your scrollback"
type:
- post
- posts
title: "Zellij 0.30.0: use your $EDITOR to search and save your scrollback"
images: ["/img/floating-panes-preview.png"]
description: "The latest Zellij version introduces the ability to edit your scrollback with your $EDITOR, a compact layout and much more!"
alttext: "An image of the Zellij terminal multiplexer"
weight: 10
---

We just released [Zellij 0.30.0](https://github.com/zellij-org/zellij/releases/tag/v0.30.0), which adds a few very exciting features.

The new release is available through crates.io with a `cargo install zellij`, a prebuilt binary can be downloaded directly from the release page, or you can check our [third party release page](https://github.com/zellij-org/zellij/blob/main/THIRD_PARTY_INSTALL.md) to see if it's already available for your distro.

Starting this release, you can also try Zellij without installing it (check out the main page: [https://zellij.dev](https://zellij.dev)).

So what's new?

### Edit your scrollback in your default $EDITOR
Imagine you're working in a session and you'd like to:
1. Save all your scrollback for later for reference or to send to a friend
2. Copy parts of the scrollback and save them in a different file
3. Search through the scrollback just like you would through a normal file

Starting with this version, you can issue a `Ctrl + <s> + <e>` and Zellij will open the editor you have defined in `$EDITOR` or `$VISUAL` (eg. /usr/bin/vim) in place instead of your pane.
There you can edit the file, save it, copy from it or search inside it. Once you close the editor (or close the pane normally with `Ctrl + <p> + <x>`), you'll be back in your pane where you started.

{{< video "/video/edit-buffer-demo.mp4" "my-5" >}}

### Compact layout

One of the things we hear a lot from users is that while they really like the discoverability of the Zellij UI, after a while once they've learned the shortcuts it takes up too much screen real-estate.
Starting this version, Zellij also includes a "compact" layout. You can get it by starting Zellij with:

```
zellij --layout compact
```

This version of our UI includes just one bar with the session name, tabs and the current input mode.

{{<figure src="/img/compact-bar.png" class="center">}}

If you'd like even more screen space, you can always additionally disable the pane frames. At run time using `Ctrl + <p> + <z>` or in the config using `pane-frames: false`.

### Handy Tips at Runtime

One of the cool things about Zellij is that a lot of its features are community driven. Contributed not as part of an official roadmap, but in order to scratch an itch for one or more of its users. As such, these can sometimes be a little challenging to discover. No matter how much documentation we add, there is no substitute to finding out about these extra features from the app itself.

Starting this version - if you do choose to load the full UI with the status bar - you'll see a random tip on the bottom line to hopefully help brighten up your workflow.

{{<figure src="/img/tip-preview.png" class="center">}}

#### [And there's lots more in this version!](https://github.com/zellij-org/zellij/releases/tag/v0.30.0)

### So what's next for Zellij?

We've recently published a roadmap for the near to medium future. You can check it out [here](https://zellij.dev/roadmap).

Zellij is a volunteer not-for-profit open-source project. Most of our maintainers have started out contributing features and fixing bugs. If one of the features in the roadmap interests you, we'd be very happy to guide you through implementing it. Feel free to drop by one of our chat servers (links in the [README](https://github.com/zellij-org/zellij)) or ask for help in the issue directly.

Happy terminal multiplexing!
