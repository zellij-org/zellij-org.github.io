---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2023-08-29
linktitle: "Zellij 0.38.0: including a session-manager, plugin infrastructure improvements and an end to offensive session names"
type:
- post
- posts
title: "Zellij 0.38.0: including a session-manager, plugin infrastructure improvements and an end to offensive session names"
type:
images: ["/img/zellij-session-manager.png"]
description: "This release includes a new built-in plugin to navigate across sessions, configurable plugins, a plugin permission system and much more!"
alttext: "An image of the Zellij session manager, showing a list of sessions it would be possible to switch to, as well as information about their tabs, panes and connected users"
weight: 10
---
## Session Manager
![Zellij session manager](/img/zellij-session-manager-animated.gif)

This much requested feature has been implemented as a built-in plugin, allowing users to switch between sessions and move focus to specific tabs or panes in the current or other sessions. And of course, one can fuzzy-find through pane names (often provided by the application running inside the terminal), tab names or session names.

All of this functionality is now available as part of Zellij's plugin API - so users are welcome and encouraged to fork the plugin and change its behavior to their liking.

## Move Panes Between Tabs
It's now possible to move panes (tiled or floating) between tabs and even to "break" a pane into a new tab (essentially creating a new tab around this pane).

## Randomly Generated Names No Longer Offensive
Until now, we have used a random name generator for the Zellij session names. We thought this would be a nicer experience than having to remember strings of hexadecimal characters. Unfortunately, the name generator included some unfortunate random combinations. We apologize for this and have now sanitized the lists to only have unobjectionable names.

## Plugin Infrastructure Improvements
### Plugins are now configurable
It's now possible to send arbitrary user configuration to plugins. Meaning plugins can be instantiated with different configuration to illicit different behavior. This configuration can be provided when loading a plugin through a Zellij [layout](https://zellij.dev/documentation/layouts) or when loading them from the [command line](https://zellij.dev/documentation/cli-actions#launch-or-focus-plugin).

### New plugin permission system
![Zellij plugin permission request](/img/zellij-plugin-permission-request.png)

Externally loaded plugins must now request permission to perform sensitive operations on the user's workspace. When a plugin is loaded, it should request the permissions it needs and these will be presented to the user for their authorization.

### Plugins are now forwards compatible thanks to protobuffers
Up until now, to pass complex data structures to our [webassembly plugins](/news/new-plugin-system), we would serialize/deserialize them through STDIN/STDOUT using a json representation. While a good solution at a pinch, its schemaless nature created a lot of grief when loading plugins compiled for a different version of Zellij.

Starting this version, we transfer these data structures over the same medium using [protocol buffers](https://protobuf.dev). This makes plugins essentially forwards compatible (unless there is breaking API behavior change), and makes it much easier to share these data structures with SDKs for other languages.

We hope to declare a blanket future compatibility for all plugins some day, but can't promise it at this point. Our plugin system is still young and growing and we might have to break compatibility here and there. We do promise to be as verbose and communicative about it as possible.

*Aside: We are aware there are native webassembly solutions for this problem in the works, but at the time of implementation to the best of our knowledge none of them were declared as stable. We look forward to consider them as an add-on when they are stabilized.*

## [Read the release notes for more information and a full list of changes](https://github.com/zellij-org/zellij/releases/tag/v0.38.0)

## Do you like Zellij?
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads.

So if the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
