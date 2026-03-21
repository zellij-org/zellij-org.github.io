---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2026-03-23
linktitle: "Zellij 0.44.0: Remote Sessions, Windows Support, Automation"
type:
- post
- posts
title: "Zellij 0.44.0: Remote Sessions, Windows Support, CLI Automation"
images: ["/img/layout-manager-demo.png"]
description: "Attach to remote sessions over HTTPS, native Windows support, workspace automation with command sequences and new CLI primitives, click-to-open file paths and much more."
alttext: "A screenshot of Zellij demonstrating remote session access and the new CLI capabilities"
tags: ["release", "feature", "remote", "windows", "cli"]
weight: 10

---

{{<video-left-aligned "/video/version-044-intro.mp4">}}

Zellij 0.44.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.44.0)

Some highlights:

- [Native Windows Support](#native-windows-support)
- [Layout Manager](#layout-manager)
- [Terminal-to-Terminal Attach over HTTPS](#terminal-to-terminal-attach-over-https)
- [Read-Only Session Sharing](#read-only-session-sharing)
- [CLI Automation](#cli-automation)
- [Resize Panes with the Mouse](#resize-panes-with-the-mouse)
- [Click-to-Open File Paths](#click-to-open-file-paths)
- [New Session Manager UI](#new-session-manager-ui)
- [New Rust APIs](#new-rust-apis)
- [Infrastructure Overhaul](#infrastructure-overhaul)
- [Please Support the Zellij Developer](#please-support-the-zellij-developer-) ❤️

## Native Windows Support
<!-- {{<figure src="/img/windows-support.png" width="900px;" alt="A screenshot of Zellij running natively on Windows">}} -->
Zellij now runs natively on Windows(!!). Achieved through a major community code contribution, at long last Zellij is truly multi-platform. Allowing windows users to enjoy the same session management, workspace automation, plugin ecosystem and multiplayer capabilities that have been available on Linux and macOS since the inception of the tool. We are truly excited.

Special thanks to [divens](https://github.com/divens) for the implementation and hard work.

## Layout Manager
{{<figure src="/img/layout-manager-demo.png" width="900px;" alt="A screenshot of the new layout manager ui">}}
This release introduces a new `layout-manager` interface, allowing users to:

1. Open their favorite layouts in a new tab or tabs
2. Apply their layouts to the current tab (optionally keeping panes that do not match the layout or closing them outright)
3. Create new layouts on the fly by recording the current tab state


## Terminal-to-Terminal Attach over HTTPS
<!-- {{<figure src="/img/remote-sessions-demo.png" width="900px;" alt="A screenshot of a Zellij remote session accessed from a different machine">}} -->
Building on the web server introduced in 0.43.0, Zellij now allows attaching to remote sessions over HTTPS directly from the terminal. No browser needed. This is done through a built-in web client that connects to a remote Zellij session running the web server just like a browser would - same authentication, same tokens.

```
zellij attach https://example.com/my-cool-session
```

## Read-Only Session Sharing
A much requested feature since the introduction of the web server has been the ability to connect to sessions read-only, without being able to affect them through keyboard/mouse input or window resizes. In this release we introduce this ability both through the terminal (with `zellij watch <session-name>`) and - more interestingly - through the browser, using read-only authentication tokens. These tokens can be created from the CLI with `zellij web --create-read-only-token` or through the `share` plugin (`Ctrl o` + `s`).

We think this can create interesting opportunities to use Zellij for teaching, demonstrations, screencasting or streaming. We look forward to seeing what the community comes up with.

## CLI Automation
<!-- {{<figure src="/img/cli-automation-demo.gif" width="900px;" alt="An animated gif demonstrating CLI automation with command sequences">}} -->
This release dramatically expands what can be accomplished from the command line, enabling the creation of powerful workspace automations.

### Conditionally Blocking Command Panes
The `zellij run` command has allowed users to run commands in new panes from the CLI for a while. This release adds the `--blocking`, `--block-until-exit-success` and `--block-until-exit-failure` flags. Using these we can conditionally block the CLI before moving to the next command.

We can use this for example to perform simple and powerful control flows such as `zellij run --block-until-exit-success -- cargo test && zellij run --blocking -- cargo build --release && tput bel`: building our release asset only after the tests have passed, allowing Human intervention and re-run of the tests as part of a dashboard experience. Finally, sending a terminal bell notification once the whole process is done.

### New and Improved CLI Actions
- **`zellij action list-panes`** - List all panes in the current session, including their IDs and metadata such as title, running command, coordinates, etc.
- **`zellij action send-keys`** - Send Human readable keystrokes to other panes (eg. `zellij action send-keys --pane-id 1 "Ctrl c" "Enter"`)
- **`zellij action dump-screen`** - Dump the viewport and optionally scrollback of any pane in any session to the CLI, optionally with colors and styling
- **`zellij subscribe`** - Subscribe to pane viewport and scrollback updates in real-time from the CLI, enabling external tools to react to terminal content changes

### Improved Ergonomics
- New `detach` and `switch-session` CLI commands
- Atomically show or hide floating panes (rather than just toggling)

### Pane/Tab ID Return Values
CLI and plugin methods that create panes and tabs now return the IDs of the newly created resources, allowing users to use these IDs for further commands instead of finding them through queries.

## Resize Panes with the Mouse
{{<figure src="/img/resize-with-mouse-demo.gif" width="900px;" alt="A screenshot of a read-only Zellij session">}}
Panes can now be resized with the mouse, both by dragging their borders and with `Ctrl` + `scrollup`/`scrolldown`.

## Click-to-Open File Paths
{{<figure src="/img/click-to-open-filepaths-demo.gif" width="900px;" alt="A screen recording demonstrating click-to-open file paths in the viewport">}}
Zellij now detects file paths in the terminal viewport and allows opening them with a click. This is useful when navigating compiler errors, log files, grep results or any output containing file paths.

Plugins can also highlight arbitrary text in the viewport, opening possibilities for custom link handlers, code annotations and interactive terminal overlays.

## New Session Manager UI
{{<figure src="/img/new-session-manager-ui-demo.png" width="900px;" alt="A screenshot of the new session manager UI">}}
The session manager UI has been simplified. It now provides a single screen that allows users to create new sessions, attach to existing ones or resurrect exited ones. Fuzzy-finding between all of them in the same namespace.

## New Rust APIs
It is Zellij development policy to create new UI interfaces as built-in plugins. This means that the new APIs created for all the above interfaces are now also available for third-party plugins (gated behind relevant permissions).
These capabilities include:

1. **Read pane scrollback** - Plugins can now read the scrollback buffer of other panes, optionally including the ANSI colors and styling
2. **Configuration propagation** - Changes to plugin configuration are now propagated to running plugins
3. **Query environment variables** - Plugins can query env vars set upon session creation
4. **Highlight viewport text** - Plugins can change the style of arbitrary text in any pane's viewport, optionally on mouse hover, optionally receiving an event when the user `Alt` + `Click`s them
5. **Change pane colors** - Set foreground/background colors of panes
6. **Explicit session save** - Trigger a session save for resurrection without waiting for the automatic interval

## Infrastructure Overhaul
Under the hood, this release includes significant infrastructure changes:

- **WASM runtime migration**: The plugin runtime has been migrated from `wasmtime` to `wasmi`, reducing binary size and improving portability
- **Async runtime migration**: the duelling async runtimes have been reduced to a single `tokio` runtime, reducing dependency count and resource utilization

## Forwards Compatibility
Due to the lack of a client-server contract, Zellij sessions have never been backwards compatible. Each version upgrade would orphan existing sessions, forcing users to manually kill them and recreate them. While this is unfortunately still the case with this version, this will be *the last time*.

A new client/server contract has been created and enforced with protocol buffers. Future versions will be able to connect to existing sessions. The only caveat being that new features won't work with old sessions and will silently fail.

## Additional Improvements
Beyond the headline features, this release includes a large number of bug fixes and quality-of-life improvements:

- **Borderless panes** - open specific panes as borderless or toggle border status at runtime
- **Terminal BEL forwarding** from unfocused tabs and panes with visual indication
- **Configurable `focus_follows_mouse` and `mouse_click_through`**
- **Line-wrapping/resize performance improvements**
- **Better STDIN segmentation with latency** (eg. over SSH)
- **Mobile web client** viewport sizing and touch scrolling improvements
- Numerous fixes for session resurrection, floating pane behavior, cursor handling, grid rendering and more

For the full list of changes, see the [CHANGELOG](https://github.com/zellij-org/zellij/blob/main/CHANGELOG.md).

## Please Support the Zellij Developer ❤️
Zellij is a labor of love and is provided free and open-source to anyone who wishes to use it.

Zellij will never display ads or collect your data.

To help sustain the project, please consider a recurring donation so that the developer can pay their bills: https://github.com/sponsors/imsnif
