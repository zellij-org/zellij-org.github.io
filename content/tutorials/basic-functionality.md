---
title: "Basic Development with Zellij"
images: ["/img/tutorial-1-preview.png"]
description: "How to use Zellij as a powerful engine for terminal development"
linktitle: "How to use Zellij as a powerful engine for terminal development"
---
{{<video-left-aligned "/video/basic-development-screencast.mp4">}}

This screencast demonstrates some basic features of Zellij, tying them into some real-world use cases as a demonstration.

The tutorial lists all the relevant actions for easy reference as well as some bonus content.

## What we'll cover
- [The Zellij UI](#the-zellij-ui)
- [Opening New Panes](#opening-new-panes)
- [Using Floating Panes](#using-floating-panes)
- [Using Multiple Pane Select](#using-multiple-pane-select)
- [Editing Pane Scrollback with your own $EDITOR](#editing-the-scrollback-with-your-own-editor)
- [Do you like Zellij?](#do-you-like-zellij-) ❤️

## The Zellij UI
{{<figure src="/img/zellij-ui.png" class="center" style="max-width 995px;" alt="An image of the Zellij UI, with labels for the tab bar, the status bar and the session name">}}

On the top of the Zellij UI is the `tab-bar`, showing us our session name (by default a randomly generated Human readable name), and the tabs we have in this session.

On the bottom, we have the `status-bar`, showing us the key shortcuts we can use to enter the various modes as well as the immediate shortcuts on the right we can use to perform context-dependent immediate actions (for example: opening a new pane).

## Opening New Panes
{{<figure src="/img/zellij-new-panes.png" class="center" style="max-width 995px;" alt="An image of Zellij, demonstrating splitting panes to the right and down, as well as stacked panes (several panes on top of each other)">}}

In Zellij, we normally open new panes with `Alt n`. When we issue this shortcut, Zellij opens a pane where it thinks would make the most sense depending on the other open panes in the tab.

We can also tell Zellij explicitly where to open a new pane by pressing `Ctrl p` to enter `Pane` mode and then `d` to split the focused pane Down, or `r` to split the current pane Right.

We can also open a new pane that will be "stacked" on top of the current pane with `Ctrl p` + `s`.

We can switch focus between this panes with `Alt` + `<arrow keys>` or `Alt` + `hjkl`.

## Using Floating Panes
{{<figure src="/img/zellij-floating-panes.png" class="center" style="max-width 995px;" alt="An image of Zellij with a floating pane with text labels indicating where to toggle the pane as pinned (always on top), to toggle the floating surface and to open more floating panes.">}}

Floating panes are first-class citizens in Zellij. They are can be toggled on and off and are persistent - meaning if we run a command in a floating pane, hide it and then show it again - the command will still have been running in the background and we'll see its current state.

We can toggle floating panes with `Alt f`, which will open our first floating pane (if none are open yet). Once this pane is shown, we can open more panes with `Alt n` and move focus between them with `Alt` + `<arrow keys>` or `Alt` + `hjkl`.

Floating panes can be moved around with the mouse by clicking their frame and dragging, they can also be moved with the keyboard by entering `Move` mode with `Ctrl h`.

Floating panes can also be "pinned", meaning they will remain always-on-top. This can be done by clicking the "PIN" frame with the mouse or with `Ctrl p` + `i`.

## Using Multiple Pane Select
{{<figure src="/img/zellij-multiple-select.png" class="left" style="max-width 995px;" alt="An image of the multiple-select plugin, showing 2 selected panes and a list of actions that can be performed on them in bulk.">}}

Zellij can perform bulk operations on a few panes at once. For example: "close", "break to new tab" or "stack".

To do this, one can either select the relevant panes with `Alt` + `<left-mouse-click>` (HINT: one can also keep the mouse button down and drag to select multiple panes), move to the relevant panes and click `Alt p`, or click `Alt Shift p` and have the selection follow ones focus.

When we select panes, the "Multiple Pane Select" dialog will open on the bottom right to show us which actions are available to us.

## Editing the Scrollback with your own $EDITOR
{{<figure src="/img/tutorial-1-editing-scrollback.png" class="center" style="max-width 995px;" alt="An image of Zellij with a pane open to the vim editor editing its own scrollback">}}
Zellij allows you to open a pane's existing scrollback with your own `$EDITOR` eg. vim. Once we do this, we can edit the scrollback and save it to an external file (for example, in order to send command output to a teammate).

To do this, on any pane we can press `Ctrl s` + `e`.

## Do you like Zellij? ❤️
Me too. So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

If the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
