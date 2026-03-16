---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2026-03-16
linktitle: "Zellij 0.44.0: Remote Sessions, Windows Support, Automation"
type:
- post
- posts
title: "Zellij 0.44.0: Remote Sessions, Windows Support, CLI Automation"
images: ["/img/version-44-social-preview.png"]
description: "Attach to remote sessions over HTTPS, native Windows support, workspace automation with command sequences and new CLI primitives, click-to-open file paths and much more."
alttext: "A screenshot of Zellij demonstrating remote session access and the new CLI capabilities"
tags: ["release", "feature", "remote", "windows", "cli"]
weight: 10

---
Zellij 0.44.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.44.0)

Some highlights:

- [Native Windows Support](#native-windows-support)
- [Terminal Attach over HTTPS](#terminal-attach-over-https)
- [Read-Only Session Sharing](#read-only-session-sharing)
- [CLI Automation](#cli-automation)
- [Resize Panes with the Mouse](#resize-panes-with-the-mouse)
- [Click-to-Open File Paths](#click-to-open-file-paths)
- [Layout Manager](#layout-manager)
- [New Session Manager UI](#new-session-manager-ui)
- [New Rust APIs](#new-rust-apis)
- [Infrastructure Overhaul](#infrastructure-overhaul)
- [Please Support the Zellij Developer](#please-support-the-zellij-developer-) ❤️

## Native Windows Support
<!-- {{<figure src="/img/windows-support.png" width="900px;" alt="A screenshot of Zellij running natively on Windows">}} -->
Zellij now runs natively on Windows. This has been a long-requested feature and represents a significant engineering effort spanning multiple PRs to bring full Zellij functionality to the Windows platform.

Windows users can now enjoy the same workspace management, plugin ecosystem and multiplayer capabilities that have been available on Linux and macOS.

## Terminal Attach over HTTPS
<!-- {{<figure src="/img/remote-sessions-demo.png" width="900px;" alt="A screenshot of a Zellij remote session accessed from a different machine">}} -->
Building on the web client introduced in 0.43.0, Zellij now allows attaching to remote sessions over HTTPS directly from the terminal. No browser needed.

```
zellij attach https://example.com/my-cool-session
```

This means any machine running Zellij with the web server enabled can be a remote development target - accessible from any other machine with Zellij installed. Combined with the existing web client, this creates a flexible remote access story: terminal-to-terminal for daily work, browser for quick access from untrusted machines.

## Read-Only Session Sharing
<!-- {{<figure src="/img/read-only-session-demo.png" width="900px;" alt="A screenshot of a read-only Zellij session">}} -->
Sessions can now be attached in read-only mode, whether from the terminal or the browser. This is useful for demonstrations, teaching, monitoring and pair programming where one participant should observe without interfering.

```
zellij attach --read-only https://example.com/my-cool-session
```

Read-only web authentication tokens can also be generated separately, allowing the sharing of view-only access to sessions without risk of unintended input. This creates a clear separation between collaborators who need full control and those who only need to observe - without any configuration on the viewer's side.

## CLI Automation
<!-- {{<figure src="/img/cli-automation-demo.gif" width="900px;" alt="An animated gif demonstrating CLI automation with command sequences">}} -->
This release dramatically expands what can be accomplished from the command line, turning Zellij into a scriptable workspace automation engine.

### Command Sequences
A new command sequence system allows chaining multiple Zellij actions together with conditional blocking. Actions in a sequence can wait for the previous action to complete before proceeding, making it possible to build reliable multi-step automation workflows from the CLI or from plugins.

### New CLI Actions
- **`zellij action list-panes`** - List all panes in the current session, including their IDs
- **`zellij action send-keys`** - Send keystrokes to other panes, enabling automation workflows
- **`zellij action paste`** - Paste large buffers into panes from the command line, useful for sending large blocks of text that would otherwise be slow through normal pasting
- **`zellij subscribe`** - Subscribe to pane viewport and scrollback updates in real-time from the CLI, enabling external tools to react to terminal content changes

### Query and Inspect
- Query tab information (id, name, position) from the CLI
- Dump the viewport of any specific pane to STDOUT or to a file, optionally with ANSI escape codes for color rendering in supported editors

### Improved Ergonomics
- **`--pane-id` and `--tab-id`** flags added to all relevant CLI actions, allowing precise targeting of specific panes and tabs
- **`--ansi`** flag added to all relevant screendump commands
- New `detach` and `switch-session` CLI commands
- Atomically show or hide floating panes (rather than just toggling)
- Specify `close_on_exit` when opening panes in place from keybindings or CLI

### Pane/Tab ID Return Values
CLI and plugin methods that create panes and tabs now return the IDs of the newly created resources, enabling further programmatic interaction.

## Resize Panes with the Mouse
<!-- {{<figure src="/img/mouse-resize-demo.gif" width="600px;" alt="A screen recording demonstrating mouse-based pane resizing">}} -->
Panes can now be resized by dragging their borders with the mouse. This complements the existing keyboard-based resizing and stacked resize features, providing a more intuitive way to adjust workspace layouts.

## Click-to-Open File Paths
<!-- {{<figure src="/img/click-to-open-demo.gif" width="600px;" alt="A screen recording demonstrating click-to-open file paths in the viewport">}} -->
Zellij now detects file paths in the terminal viewport and allows opening them with a click. This is useful when navigating compiler errors, log files, grep results or any output containing file paths.

Plugins can also highlight arbitrary text in the viewport, opening possibilities for custom link handlers, code annotations and interactive terminal overlays.

## Layout Manager
This release introduces a new `layout-manager` interface and accompanying plugin API commands. Layouts can now be overridden at runtime, allowing dynamic workspace reconfiguration without restarting sessions.

## New Session Manager UI
<!-- {{<figure src="/img/new-session-manager.png" width="800px;" alt="A screenshot of the new session manager UI">}} -->
The session manager has received a UI refresh, providing a more streamlined experience for managing multiple Zellij sessions.

## New Rust APIs
This release continues expanding the plugin ecosystem with new capabilities:

1. **Read pane scrollback** - Plugins can now read the scrollback buffer of other panes
2. **Configuration propagation** - Changes to plugin configuration are now propagated to running plugins
3. **Query environment variables** - Plugins can query env vars set upon session creation (gated behind a permission)
4. **Highlight viewport text** - Plugins can highlight arbitrary text in any pane's viewport
5. **Change pane colors** - Set foreground/background colors of panes through the plugin API
6. **Dump viewport with styles** - Dump pane viewport including ANSI escape codes
7. **Explicit session save** - Trigger a session save for resurrection without waiting for the automatic interval
8. **Canonicalized tab IDs** - `tab_id` vs `tab_position` has been canonicalized, and `tab_id` is now exposed to plugins

## Infrastructure Overhaul
Under the hood, this release includes significant infrastructure changes:

- **WASM runtime migration**: The plugin runtime has been migrated from `wasmtime` to `wasmi`, reducing binary size and improving portability
- **Async runtime migration**: `async_std` has been replaced with `tokio`, aligning with the broader Rust ecosystem
- **Architecture refactor**: Logical structures have been moved from the client to the server, improving the foundation for remote access features
- **Rust toolchain**: Updated to 1.92.0

## Additional Improvements
Beyond the headline features, this release includes a large number of bug fixes and quality-of-life improvements:

- **Borderless panes** - open panes as borderless or toggle border status at runtime
- **Terminal BEL forwarding** from unfocused tabs with visual indication
- **Configurable `focus_follows_mouse` and `mouse_click_through`**
- **Disabling automatic OSC8 hyperlink formatting**
- **Line-wrapping/resize performance improvements**
- **Better STDIN segmentation with latency** (eg. over SSH)
- **Cross-version session compatibility**
- **Mobile web client** viewport sizing and touch scrolling improvements
- Numerous fixes for session resurrection, floating pane behavior, cursor handling, grid rendering and more

For the full list of changes, see the [CHANGELOG](https://github.com/zellij-org/zellij/blob/main/CHANGELOG.md).

## Please Support the Zellij Developer ❤️
Zellij is a labor of love and is provided free and open-source to anyone who wishes to use it.

Zellij will never display ads or collect your data.

To help sustain the project, please consider a recurring donation so that the developer can pay their bills: https://github.com/sponsors/imsnif
