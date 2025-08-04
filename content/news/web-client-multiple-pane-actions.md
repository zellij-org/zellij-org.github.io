---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2025-08-05
linktitle: "Zellij 0.43.0: web client, multiple pane actions, compact-bar tooltips"
type:
- post
- posts
title: "Zellij 0.43.0: web client, multiple pane actions, compact-bar tooltips"
images: ["/img/version-43-social-preview.png"]
description: "Share sessions in the browser, perform bulk operations on multiple panes, toggle tooltips in the compact-bar..."
alttext: "A screenshot of the Zellij share plugin, explaining how to share a session in the browser"
weight: 10

---
{{<video-left-aligned "/video/web-client-intro.mp4">}}

Zellij 0.43.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.43.0)

Some highlights:

- [Web Client](#web-client)
- [Multiple Select](#multiple-select)
- [Key Tooltips](#key-tooltips)
- [Stack Pane Keybinding](#stack-pane-keybinding)
- [New Rust Plugin APIs](#new-rust-plugin-apis)
- [Performance Improvements](#performance-improvements)
- [Please Support the Zellij Developer](#please-support-the-zellij-developer-) ❤️


## Web Client
{{<figure src="/img/web-client-preview.png" width="900px;" alt="A screenshot of a Zellij session running inside a browser">}}
Zellij was never meant to live exclusively in your terminal, and this release brings it to the browser. With a keypress, you can now share existing sessions to the browser with Zellij's multiplayer capabilities: each client getting their own cursor.

No more "can you share your screen?", no more ssh key exchange and NAT traversal dances. Just simple, secure sessions in your browser.

Use for remote access, teaching, demos, collaborative debugging or even as your daily driver - making a dedicated terminal emulator optional.

### Bookmarkable Sessions
Each session gets its own unique URL (eg. `https://127.0.0.1/my-session-name`)

- Hit that URL while the session is running and you attach to it directly.
- Hit it after the session has exited and Zellij resurrects it with the same layout and commands.
- Enter a new URL and a session by that name is created.

Bookmark your favorite sessions and you will always be able to come back to them - locally, from a different trusted machine or even from your phone.

### Built-In Security Measures
Your terminal is a vulnerable and private interface. Access to it must be carefully guarded and protected.

For this reason, Zellij requires any user be authenticated with a special token before they can log in from the browser. These tokens can be generated and revoked, but are kept hashed in a local database, so can never be displayed again. They are never saved in your browser or written to any storage.

In addition, Zellij enforces the use of HTTPS with a user-provided certificate if listening on a public interface (anything that is not localhost/127.0.0.1).

These security measures cannot be disabled.

### Don't like this feature?
No problem. Zellij now also offers a `zellij-no-web` release without the web client or any of its dependencies.

## Multiple Select
{{<figure src="/img/multiple-select-demo.gif" width="900px;" alt="An animated gif demonstrating the multiple select feature - first selecting 3 panes and stacking them, then selecting 3 other panes and making them floating. ">}}
This release adds the ability to perform bulk operations on several panes at once. Mark several panes either with the mouse or with a keyboard shortcut, then:

1. Turn them into a stack
2. Break them out to a new or existing tab
3. Make them all floating/embedded
4. Close them all

To mark panes: `Alt p` while focused on the pane (or `Alt <left-mouse-click>` on any pane) and then follow the on-screen instructions.

## Key Tooltips
{{<figure src="/img/compact-bar-tooltip-demo.gif" width="900px;" alt="An animated gif demonstrating the multiple select feature - first selecting 3 panes and stacking them, then selecting 3 other panes and making them floating. ">}}
A much requested feature has been to be able to temporarily see the keybinding hints without having them constantly take up valuable screen space. This release includes the ability to add temporary tooltips for use with the existing compact-bar. These tooltips can either be toggled or only displayed as needed when performing operations outside of the base mode.

To use in the [zellij config](https://zellij.dev/documentation/configuration.html):

```javascript
// compact-bar location="zellij:compact-bar" { <== comment out this line
compact-bar location="zellij:compact-bar" { // replace it with these lines
    tooltip "F1" // choose a keybinding to toggle the hints
}
default_layout "compact" // make sure this is set so you'll get the compact-bar instead of the default UI
```

## Stack Pane Keybinding
Zellij has included stacked panes for a while, but this release adds the ability to explicitly create a stacked pane inside the currently focused pane - making this feature more accessible.

By default: `Ctrl p` + `s` (or `Ctrl g` + `p` + `s` for "unlock-first").

## New Rust Plugin APIs
Since many of these new features are implemented as built-in plugins, this also adds lots of interesting APIs for Rust plugins.

1. `GroupAndUngroupPanes(Vec<PaneId>, Vec<PaneId>, bool), // panes to group, panes to ungroup, bool -> for all clients,` - used for multiple select
2. `HighlightAndUnhighlightPanes(Vec<PaneId>, Vec<PaneId>), // panes to highlight, panes to unhighlight` - used for mouseovers, but can be used for other things (eg. bookmarking panes)
3. `CloseMultiplePanes(Vec<PaneId>)`, `FloatMultiplePanes(Vec<PaneId>)`, `EmbedMultiplePanes(Vec<PaneId>)` - used for multiple select and will operate on the panes that have been grouped, either by the API or by the user
4. Web client operations:
    - `StartWebServer`
    - `StopWebServer`
    - `ShareCurrentSession`
    - `StopSharingCurrentSession`
    - `QueryWebServerStatus`
    - `GenerateWebLoginToken(Option<String>) // String -> optional token id`
    - `RevokeWebLoginToken(String)           // String -> token id (provided or generated)`
    - `ListWebLoginTokens`
    - `RevokeAllWebLoginTokens`
    - `RenameWebLoginToken(String, String), // (original token id, new token id)`
5. `InterceptKeyPresses` - temporarily intercept all user keypresses (excluding actions), not just ones sent to the plugin directly
6. `ClearKeyPressesIntercepts` - clears the above intercept (also happens automatically on plugin close)
7. `ReplacePaneWithExistingPane(PaneId, PaneId), // (pane id to replace, pane id of existing)` - useful for pane pickers

All of these APIs are behind relevant permissions, for more information see the [plugin documentation](https://zellij.dev/documentation/plugins.html).

## Performance Improvements
This version includes a global debounced async rendering mechanism for both terminal text and Zellij actions such as opening new panes. This serves to reduce the number of renders and make the experience of using the app much smoother.

## Please Support the Zellij Developer ❤️
Zellij is a labor of love and is provided free and open-source to anyone who wishes to use it.

Zellij will never display ads or collect your data.

To help sustain the project, please consider a recurring donation so that the developer can pay their bills: https://github.com/sponsors/imsnif
