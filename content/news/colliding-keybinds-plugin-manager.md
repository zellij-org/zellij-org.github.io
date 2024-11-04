---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2024-11-04
linktitle: "Zellij 0.41.0: Solutions for Colliding Keybindings, Plugin Manager, new UI"
type:
- post
- posts
title: "Zellij 0.41.0: Solutions for Colliding Keybindings, Plugin Manager, new UI"
type:
images: ["/img/presets-diagram.png"]
description: "A solution for the colliding keybindings problem, a new plugin manager and UI, reloading configuration at runtime and a new setup wizard."
alttext: "A diagram explaining the different keybinding presets"
weight: 10

---
Zellij 0.41.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.41.0)

Here's a short video demonstrating the highlights. Be sure to scroll down to read more!

{{<video-left-aligned "/video/version-041-intro.mp4">}}

Some highlights:

- [Solutions for Colliding Keybindings](#solutions-for-colliding-keybindings)
- [Support for multiple-modifiers and the kitty keyboard protocol](#support-for-multiple-modifiers)
- [Change the Configuration at Runtime](#change-the-configuration-at-runtime)
- [New UI](#new-ui)
- [Configuration Screen and Setup Wizard](#configuration-screen-and-setup-wizard)
- [Load Layouts from the Web](#load-layouts-from-the-web)
- [New Plugin APIs](#new-plugin-apis)
- [A new Plugin Manager](#a-new-plugin-manager)
- [New Themes](#new-themes)
- [Do you like Zellij?](#do-you-like-zellij-) ❤️

## Solutions for Colliding Keybindings
{{<figure src="/img/presets-diagram.png" width="800px;" alt="A diagram explaining the different keybinding presets">}}
A problem that has plagued users of Zellij since its inception is the "colliding keybindings" issue. Where Zellij would take up a keyboard shortcut that an app running inside it would be listening for. For example, Zellij uses the `Ctrl o` shortcut to enter [`Session` mode](https://zellij.dev/documentation/keybindings-modes), and vim uses the same shortcut to jump forward in the user's [jumplist](https://vimtricks.com/p/vim-jump-list/). 

While users were always able to circumvent this issue by rebinding keys in the configuration file, this release now offers two easy solutions that do not require any thought, design or tinkering:

1. One is now able to choose a "non-colliding" keybinding preset, where one unlocks the interface before entering the various modes
2. It's now possible to rebind the leader keys (by default `Ctrl` for modes and `Alt` for quick shortcuts) at runtime

Both of these (as well as a combination of the two) can be chosen and applied through the new [configuration screen](#configuration-screen-and-setup-wizard)

## Support for Multiple Modifiers
{{<figure src="/img/rebind-keys-1.png" width="800px;" alt="Rebinding keys in the new Zellij Configuration">}}
Zellij has chosen to adopt the [Kitty Keyboard Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/) which has recently been growing in popularity among terminal emulators. With the help of this protocol, Zellij now allows users to bind multiple modifiers to specific actions (eg. `Ctrl Alt a`) as well as special previously unavailable modifiers (eg. `Super a`).

Zellij of course also supports this protocol for applications running inside its panes.

Note that in order to take advantage of this feature, one must also use a terminal emulator that supports it. The Zellij maintainers recommend `Alacritty` or `WezTerm`.

## Change the Configuration at Runtime
Starting from this release, Zellij supports changing the configuration file and having the changes applied at runtime. We recommend trying it out by switching to one of the [new themes](#new-themes) and seeing them applied to the UI in real time.

## New UI
The Zellij status-bar has been redesigned, offering a variation for users choosing the "Unlock First" [keybinding preset](#solutions-for-colliding-keybindings) as well as a new more conceise one-line look for the default preset.
{{<figure src="/img/new-status-bar.png" width="800px;" alt="An image of the new Zellij status bar">}}

## Configuration Screen and Setup Wizard
{{<figure src="/img/setup-wizard.png" width="800px;" alt="A image of the Zellij setup wizard">}}
In order to facilitate the usage of the new [Non-Colliding Keybinding Preset](#solutions-for-colliding-keybindings), Zellij will now display a short setup wizard on first run. This setup wizard will allow users to discover the new keybinging preset and either choose to use it immediately or know that they can switch to it at a later time.

The setup wizard can be accessed as a configuration screen in-app by pressing:
* `Ctrl o` + `c` in the default preset
* `Ctrl g` + `o` + `c` in the non-colliding preset

## Load Layouts from the Web
[Layouts](https://zellij.dev/tutorials/layouts/) are the core automation primitive of Zellij. They allow users to create their own personalized workspaces, automate tasks and share all of this with others in a friendly Human-readable file. Starting this release, Zellij allows users to load layouts directly from the web: `zellij --layout https://example.com/my-layout.kdl`.

For security reasons, all commands in these layouts will be suspended behind a `Waiting to run <command>`, prompting the user's approval before running each one. Plugins - as always - will require explicit user permissions in order to perform sensitive actions.

This is a great way to share workspaces with others for fun and collaboration.

## New Plugin APIs
This release offers many new plugin APIs (gated behind relevant permissions), a few examples include:
1. Rebind keys at runtime as well as reconfigure Zellij (used by the built-in [configuration](#configuration-screen-and-setup-wizard))
2. Controlling `command` panes (knowing when they were opened, closed, exited, re-run) and getting information about their exit code
3. Hiding and showing panes based on their pane id
4. Control other panes (everything from writing input to arbitrary panes, changing them to fullscreen, toggle their floating status, etc.)
5. Load/reload other plugins
6. List-clients (including their focused pane_id, running command or plugin url)

This release also introduces a new `load_plugins` configuration section, allowing users to load plugins in the background on session start.

## A New Plugin Manager
{{<figure src="/img/plugin-manager-1.png" width="800px;" alt="A image of the Zellij plugin manager">}}
As the Zellij plugin ecosystem begins growing, it's becoming more and more difficult to keep track of which plugins are running inside a Zellij session. For this reason, the new release introduces a new Plugin Manager. Allowing users to track which plugins they have running inside the session and where they got them from. Users can also use it to easily load new plugins, specify configuration for them as well as reload existing ones.

The plugin manager can be accessed by default with `Ctrl o` + `p`.

## New Themes
{{<figure src="/img/new-theme.png" width="800px;" alt="A screenshot of Zellij with the new night owl theme">}}
This release includes many different themes added by the community. You can see the new "night-owl" theme above. For a full list of themes, please see the [theme list](/documentation/theme-list.html).

## Do you like Zellij? ❤️
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

So if the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
