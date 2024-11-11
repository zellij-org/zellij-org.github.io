---
title: "Dealing with Colliding Keyboard Shortcuts"
images: ["/img/configuration-screen-1.png"]
description: "How to quickly solve the issue of Zellij intercepting keys while still maintaining peak efficiency in one\'s workflow"
linktitle: "How to quickly solve the issue of Zellij intercepting keys while still maintaining peak efficiency in one\'s workflow"
---
{{<video-left-aligned "/video/colliding-keybindings-screencast.mp4">}}

This tutorial demonstrates how to solve the "Colliding Keybindings" problem, in which the Zellij UI intercepts keys meant for the applications running inside Zellij.

*The video screencast and the tutorial contain the same content.*


## What we'll cover
- [The Problem - what are colliding keybindings?](#the-problem)
- [The Solution - the "Unlock-First (non-colliding)" Preset](#the-solution)
- [Rebinding the "Unlock toggle" or the secondary modifier (Alt)](#rebinding-the-unlock-toggle-ctrl-g-or-the-secondary-modifier-alt)
- [Manually Changing the configuration file](#manually-changing-the-configuration-file)
- [Do you like Zellij?](#do-you-like-zellij--)

## The Problem
Zellij intercepts certain keys that we as users expect to be sent to the applications running inside Zellij. For example, Zellij uses the `Ctrl o` shortcut to enter [`Session` mode](https://zellij.dev/documentation/keybindings-modes), and vim uses the same shortcut to jump forward in the user's [jumplist](https://vimtricks.com/p/vim-jump-list/). 

## The Solution
{{<figure src="/img/configuration-screen-1.png" class="center" style="max-width 995px;">}}
Starting from version `0.41`, Zellij introduced a new `Unlock-First (non-colliding)` keybinding preset. In this preset, one must first "unlock" the interface in order to access the various input modes. And so, the keybindings will no-longer collide.

To apply this preset for the current session, press `Ctrl o` to enter `Session` mode, and then `c` to open the `Configuration` screen. Then press `<TAB>` to go to `Change Mode Behavior`, navigate to `Unlock-First (non-colliding)` with the down arrow, and then press `<Enter>` to apply this preset to the current session.

To save this preset to the configuration file so that it persists between sessions (and updates the other sessions on the same machine), you can do the same thing as above except press `<Ctrl a>` instead of `<Enter>`. This preset includes lots of specialized keybindings. While it cannot be applied in a single configuration option, the saved configuration file can be transferred to different machines and used to apply this preset without doing so through the `Configuration` screen every time.

## Rebinding the "Unlock toggle" (`Ctrl g`) or the secondary modifier (`Alt`)
{{<figure src="/img/configuration-screen-2.png" class="center" style="max-width 995px;">}}
In some cases, the `Unlock-First (non-colliding)` preset is not enough. For example, when one wishes to use one of the "secondary modifier actions" such as `Alt f` or `Alt n`. Or of course when one wishes to free up `Ctrl g` itself. In order to do this, one can use the same `Configuration` screen to:

1. **Change the Secondary Modifier**: this is by default `Alt`. It can be changed by going into `Session` mode (`Ctrl o` or `Ctrl g` + `o`), selecting `c` to open the `Configuration` screen, and changing the secondary modifier: navigating with the arrow keys and pressing `<SPACE>` to add or change the secondary modifier. Then pressing `<ENTER>` to apply these changes.
2. **Change the Unlock Toggle**: this is by default `Ctrl g` in when in the `Unlock-First (non-colliding)` preset. It can be changed by going into `Session` mode (`Ctrl o` or `Ctrl g` + `o`), selecting `c` to open the `Configuration` screen, and changing the unlock toggle: navigating with the arrow keys and pressing `<SPACE>` on the unlock toggle, then pressing a new modifier (for example `Alt g`).

## Manually Changing the Configuration file
If one would like more fine-grained control over which keys exactly would be bound or unbound, one can directly change them in the configuration file (without needing to restart Zellij). This can be done by editing the file and changing the keys, as detailed [here](https://zellij.dev/documentation/keybindings).

# Do you like Zellij ❤️ ?
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

So if the tool gives you value and you are able, please consider a recurring monthly donation of 5-10$ to help me pay my bills. There are Zellij stickers in it for you! https://github.com/sponsors/imsnif
