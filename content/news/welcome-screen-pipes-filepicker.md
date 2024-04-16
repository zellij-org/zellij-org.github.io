---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2024-16-04
linktitle: "Zellij 0.40.0: Welcome Screen, Filepicker, Pipes, Plugin Aliases"
type:
- post
- posts
title: "Zellij 0.40.0: Welcome Screen, Filepicker, Pipes, Plugin Aliases"
type:
images: ["/img/welcome-screen-preview.png"]
description: "A new welcome screen to facilitate session management, a new filepicker, a powerful new concept called pipes and lots of long awaited features"
alttext: "An image of the Zellij welcome screen with the Zellij filepicker opened to select the location of the session"
weight: 10
---
{{<figure src="/img/welcome-screen-preview.png" width="800px;" alt="An image of the Zellij welcome screen with the Zellij filepicker opened to select the location of the session">}}
Zellij 0.40.0 has just been released! [Grab it while it's hot!](https://github.com/zellij-org/zellij/releases/tag/v0.40.0)

Some highlights:
- [Welcome Screen](#welcome-screen)
- [New Filepicker](#new-strider--filepicker)
- [Pipes](#pipes)
- [Open Floating Panes at Specific Coordinates](#open-floating-panes-at-specific-coordinates)
- [Rearrange Tabs](#rearrange-tabs)
- [Disconnect other Clients](#disconnect-other-clients)
- [Plugin Aliases](#plugin-aliases)
- [New Possible Keys to Bind](#new-possible-keys-to-bind)
- [Start session in the background](#start-session-in-the-background)
- [Performance Improvements](#performance-improvements)
- [Do you like Zellij?](#do-you-like-zellij-) ❤️

## Welcome Screen
{{<figure src="/img/welcome-screen.gif" width="800px;" alt="A demo of the Zellij welcome screen">}}
This new release introduces the "welcome screen". The welcome screen is a friendly menu, intended to be run on terminal startup and allow users to either:
1. Start a new session (optionally with a specific name or in a chosen folder)
2. Attach to a running session
3. Resurrect an exited session

Learn more about [session management](/tutorials/session-management).

## New Strider / Filepicker
{{<figure src="/img/filepicker-demo.gif" width="800px;" alt="A demo of the Zellij filepicker fuzzy finding files and opening them in vim, then finding folders and opening a terminal in their location.">}}
This release includes a complete rework of Zellij's built-in filepicker, Strider. The filepicker allows users to quickly browse through their filesystem, opening files in their default editor in new Zellij panes or opening a terminal in a specific location.

With the help of [pipes](#pipes), one can use this filepicker to interactively choose a file or folder in the filesystem and pipe the result to another command through a traditional shell pipe. For example:

```bash
zpipe filepicker | xargs -i cp {} my-chosen-file
```

The filepicker can also be used from within other plugins to offload filepicking functionality rather than have the plugin implement it on its own. In fact, this is exactly what the welcome screen does in the example at the top of this post.

Learn more about [the filepicker](/tutorials/filepicker).

## Pipes
Zellij pipes are a new way to send messages to plugins and allow plugins to communicate with each other.

Messages can be sent to plugins through the CLI: (eg. `zpipe my-plugin hi!`), from a keybinding or indeed from another plugin. A destination plugin that does not exist will be loaded on the first pipe message.

Pipes also integrate seamlessly with existing shell pipes, providing flow control and giving plugin authors the ability to visualize data from the command line, allow users to pause a command line pipe mid-stream on certain messages or on a keystroke. We believe this functionality will help utilize the full 2 dimensions of the terminal window as never before, popping up floating panes in certain conditions and creating a many-to-many windowed pipeline. We look forward to seeing what plugin authors come up with!

[Learn more about Pipes](/documentation/plugin-pipes.html)

## Open Floating Panes at Specific Coordinates
A much requested feature after the introduction of floating panes, was to be able to open floating panes at specific coordinates and at specific sizes. Ths is now possible from the CLI, from plugins or from a keybinding (either with fixed numbers or percentage of the viewport):

```sh
zellij run --floating --width 50 --height 20% -x 10% -y 50% -- htop
```

## Rearrange Tabs
Thanks to a community contribution, it's now possible to change the position of tabs. One can move the active tab left or right, by default with `Alt i` or `Alt o`.

## Disconnect other Clients
Zellij, as a true multiplayer application, allows more than one user to attach to a running session. When this happens, each user gets their own cursor and the UI indicates in which pane or tab they are focused.

Since by necessity the smallest screen width/height is used in such cases, it is sometimes desirable to log out other users from the session.

This is now possible through the `session-manager`: `Ctrl o` to open the session manager, and then `Ctrl x` to disconnect other users.

## Plugin Aliases
This version introduces "Plugin Aliases" which are a way to shorten the long plugin URLs (eg. `https://example.com/my-plugin.wasm`, or `file:/home/aram/code/plugin/my-plugin.wasm`) to something more memorable (eg. `filter` or `filepicker`). These aliases can be defined in the [configuration file](/documentation/configuration.html), and used wherever plugin URLs can be used: to launch plugins from the CLI, from layouts or from other plugins.

Aliases can also be a convenient way to swap in the built-in plugins for a custom implementation (eg. using the excellent [zjstatus](https://github.com/dj95/zjstatus), instead of the built-in `compact` bar). Indeed, the `filepicker` described above is an internal alias for the built-in `Strider` plugin, and can be swapped out for a custom implementation of the filepicker using the same [contract](/documentation/filepicker-alias.html).

Read more about [Plugin Aliases](/documentation/plugin-aliases.html).

## New Possible Keys to Bind
Thanks to some community contributions, it is now possible to bind `Ctrl`/`Alt` + Function keys (eg. `Ctrl F1`), as well as `Ctrl Space`. We as Zellij maintainers are aware that colliding keybindings are a big problem for many users and intend to fully and finally address this issue in the next version after this one.

## Start session in the background
nother much requested feature was added in this release: it's now possible to start a new Zellij session in the background with the new `zellij attach --create-background` flag.

## Performance Improvements
This version introduces two major performance improvements:
* Line wrapping of extremely long (10M+) lines is now significantly faster thanks to a community contribution.
* Rendering of full-screen terminal applications is now much smoother thanks to the implementation of CSI 2026 (synchronized renders) in those terminals that support it.

## Do you like Zellij? ❤️
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

So if the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
