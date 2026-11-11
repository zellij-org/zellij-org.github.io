---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2026-11-11
linktitle: "Zellij 0.46: built-in terminal, attention inbox, session previews"
type:
- post
- posts
title: "Zellij 0.46: built-in terminal, attention inbox, session previews"
images: ["/img/046-preview.png"]
description: "Zellij now includes a built-in terminal, an attention inbox that integrates with your desktop, live session previews and a settings screen."
alttext: "A screenshot of the Zellij terminal window explaining that when it's closed the sessions keep running in the background and letting you know when they need your attention."
tags: ["release", "feature", "terminal", "inbox", "attention"]
weight: 10

---

{{<video-left-aligned "/video/version-046-intro.mp4">}}

Zellij 0.46.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.46.0)

Some highlights:

- [Built-in Terminal (!!)](#built-in-terminal)
- [Attention Inbox](#attention-inbox)
- [Session Previews](#session-previews)
- [Settings Screen](#settings-screen)
- [Right-Click Menu and Improved Mouse Handling](#right-click-menu-and-improved-mouse-handling)
- [Theme Editor](#theme-editor)
- [Distributions (run Zellij as a library)](#distributions-run-zellij-as-a-library)
- [Horizontal Stacks](#horizontal-stacks)
- [Allow (temporarily) Hiding the UI](#allow-temporarily-hiding-the-ui)
- [What's next?](#whats-next)
- [Please Support the Zellij Developer](#please-support-the-zellij-developer-) ❤️

## Built-in Terminal
{{<figure src="/img/terminal-desktop-preview.png" width="900px;" alt="A preview of the Zellij terminal window">}}

Zellij has always been and will always be a terminal multiplexer first. Now, it also includes a built-in terminal for those who want a more complete experience.

The built-in terminal can be run directly on the machine that runs zellij with `zellij terminal`. It uses Zellij as its UI, providing the same experience one would get if running Zellij using an external terminal. It intentionally does not have GUI tabs or splits, as I believe textual interfaces are the natural choice for those who love the terminal.

To emphasize: absolutely nothing changes for those who want to keep running Zellij as a multiplexer inside another terminal or on a remote server. Zellij is a multiplexer first and always will be.

### Performance
In developing the terminal, it was important to me to optimize performance on two fronts: input latency (typing) and textual scrolling. While not the items traditionally optimized in other desktop terminal emulators, I believe they both contribute to the best terminal user experience. Try out the terminal by typing into it, catting large files and see how it feels.

{{<figure src="/img/benchmarks.svg" width="900px;" alt="A table showing the typing latency and output throughput comparison between terminals">}}

If you'd like to learn more about the methodology used in these measurements and learn way too much about terminal benchmarking, please see [the dedicated repo](https://github.com/imsnif/benchmark-methodology)

### Desktop Integration
{{<figure src="/img/tray-preview.png" alt="An image of the Zellij tray icon and its menu">}}

Since by its very nature Zellij manages multiple sessions, I felt its terminal called for deeper desktop integration than traditionally offered by terminal emulators. The terminal comes with a tray icon in all 3 natively supported platforms (linux, mac, windows), allowing users to get an overview of their running sessions, manage their notifications and attention and even see session previews - all in one place.

On left-click, the tray icon opens the session-manager and attention inbox (see below), rendered just as they would be inside a Zellij session: as a textual interface. Regardless of which platform you're on, you'll get the same experience.

Want to learn more? Find out how to [use Zellij as your main terminal and become productive in under 5 minutes.](/tutorials/zellij-terminal)

## Attention Inbox
{{<figure src="/img/inbox-preview.png" alt="An image of the Zellij tray icon and its menu">}}
With the advent of coding agents - whether one uses them or not - terminals are increasingly being used for background tasks that require occasional attention. Zellij now includes a built-in Inbox as part of its session-manager, allowing users to see at a glance which pane, in which tab, in which session needs them. We do this with the help of the recently developed OSC7501 protocol which has quickly gained widespread support. Most relevant programs [already support it](/documentation/inbox-integrations.html), so this should not require anything from users other than upgrading their programs to a recent version.

The Inbox is also integrated with the new [terminal emulator](#desktop-integration), meaning that you can see a color-coded pill count of relevant programs that need your attention.
{{<figure src="/img/tray-pill.png" alt="An image of the Zellij tray icon with a notification pill">}}

Want to learn more? Find out how to [use Zellij to manage multiple coding agents across sessions](/tutorials/zellij-with-coding-agents).

## Session Previews
{{<figure src="/img/session-previews.png" alt="An image of the Zellij session manager, showing a list of session and one of them in the preview window">}}
The session-manager and the new inbox both now support previews. One can peak into other sessions and other panes in the current session and even enter a quick command into them without switching.

## Settings Screen
{{<figure src="/img/settings-preview.png" alt="An image of the Zellij settings screen">}}
Config files are not for everyone. I think modern GUI applications have taught many of us that a program should be deeply configurable at runtime from its various settings menus. Seeing no reason terminal programs should not have this functionality as well, this version includes a built-in settings screen that interacts seamlessly with configuration files. Accessible from the new right-click menu (see below) or from Session mode, this screen allows full configuration of Zellij in a way that might be more straightforward than hunting through configuration files.

## Right-Click Menu and Improved Mouse Handling
{{<figure src="/img/right-click-preview.png" alt="An image of the Zellij right-click menu">}}
Zellij now includes a right-click menu, allowing to perform quick actions with the mouse. It's configurable, so you can map your own custom actions on to it if you wish.

Another cool new feature is the ability to create floating panes in specific locations by ctrl+dragging with the mouse.

## Theme Editor
{{<figure src="/img/theme-editor-preview.png" alt="An image of the Zellij theme editor">}}
The settings screen described above also includes a theme-editor. For those who wish to customize the look and feel of Zellij, the editor now makes the job much easier, including built-in contrast checks and fixes to make sure everything is legible.

## Distributions (run Zellij as a library)
This version gives Rust developers the ability to run Zellij as a library. Doing this, developers can take advantage of all of Zellij's features (terminal emulation accessible through a built-in terminal and a web browser, layouts, customizable UI elements with plugins, cross platform availability and distribution) by embedding Zellij in their own application. A process sometimes called "white labelling". [More info](/documentation/distributions.html).

## Horizontal Stacks
A much loved feature of Zellij is stacked panes. It's now possible to toggle these stacks between horizontal and vertical, to help users who want to navigate across the stack vertically without changing its focus.

## Allow (temporarily) Hiding the UI
Many users who love Zellij feel the UI is too intrusive and would like the ability to hide it and only show it when they need a reference. This version allows that functionality. Either through a keybinding (`Ctrl p` + `Shift z`) or by choosing the option when right-clicking one of the tabs.

## What's next?
{{<figure src="/img/terminal-desktop-env-diagram.png" alt="A diagram of the Zellij multiplexer, web client and desktop client leading to the desktop environment.">}}

Zellij was never meant to only live in the terminal, and the last year has shown its progression: first into the browser with the web-client, and now into the desktop with the built-in terminal. We're now building it into something greater: a terminal-first desktop environment. Allowing those who love the terminal to invert the GUI-imposed order. Live in the terminal, run GUI apps such as browsers and photo editors inside your TUI as separate panes and tabs.

The basic functionality of Zellij will not change: it will always be a terminal multiplexer and allow current users to keep their workflows. Additionally, they'll be able to integrate their GUI needs into them if they so wish.

Would you like to help? Be a part of building this? Nothing is implemented yet. Now is the best time to [join](https://github.com/zellij-org/zellij/discussions/5863).

## Please Support the Zellij Developer ❤️
Zellij is a labor of love and is provided free and open-source to anyone who wishes to use it. Zellij will never display ads or collect your data.

**In recent months, venture capital supported firms have been moving into this space and using their funding and influence to take it over. Zellij is a community funded project and cannot compete on its own.
Now, more than ever, I can use your financial support to help me keep developing this project.**

If you are able, please consider a recurring donation to help me pay my bills: https://github.com/sponsors/imsnif
