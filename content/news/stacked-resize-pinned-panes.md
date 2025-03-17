---
author: "Aram Drevekenin"
authorlink: "https://hachyderm.io/@imsnif"
date: 2025-03-17
linktitle: "Zellij 0.42.0: Stacked Resize, Pinned Floating Panes, New Theme Spec"
type:
- post
- posts
title: "Zellij 0.42.0: Stacked Resize, Pinned Floating Panes, New Theme Spec"
type:
images: ["/img/version-42-social-preview-smiley.png"]
description: "Stacked resize, pinned floating panes, new theme definition spec and new Rust plugin APIs"
alttext: "A screenshot of Zellij demonstrating the stacked resize and pinned floating panes feature"
weight: 10

---
Zellij 0.42.0 has just been released! [Check it out!](https://github.com/zellij-org/zellij/releases/tag/v0.42.0)

Some highlights:

- [Stacked Resize](#stacked-resize)
- [Pinned Floating Panes](#pinned-floating-panes)
- [New Theme Definition Spec](#new-theme-definition-spec)
- [New (Rust) Plugin APIs](#new-rust-plugin-apis)
- [Double/Triple Mouse Click Text Selection in Terminals](#doubletriple-mouse-click-text-selection-in-terminals)
- [Release Notes and Tips on Startup](#release-notes-and-tips-on-startup)
- [Do you like Zellij?](#do-you-like-zellij-) ❤️

Here's a short video demonstrating the highlights. Be sure to scroll down to read more!

{{<video-left-aligned "/video/version-042-intro.mp4">}}

## Stacked Resize
{{<figure src="/img/stacked-resize-demo.gif" width="600px;" alt="A screen recording demonstrating stacked resize">}}
This version of Zellij introduces an innovative new way of managing multiple panes. When resizing panes, Zellij will attempt to stack them with their neighbors - giving us more space on screen while still keeping the title of the other panes around so that we can easily navigate to them with the keyboard or mouse.

If you want to learn more, check out the [Stacked Resizes and Pinned Floating Panes Screencast/Tutorial](/tutorials/stacked-resize).

This behavior can be disabled through the [configuration](/documentation/options.html#stacked_resize).

## Pinned Floating Panes
{{<figure src="/img/pinned-floating-panes-demo.gif" width="600px;" alt="A screen recording demonstrating pinned floating panes">}}
One of the most loved features of Zellij is its native integration of floating panes. This version adds the ability to "pin" any such pane so that it is always on top, even when not focused. Floating panes can be pinned with a mouse click or with a keyboard shortcut: `Ctrl p` + `i`.

## New Theme Definition Spec
{{<figure src="/img/theme-spec.png" width="800px" alt="A diagram of the new theme definition spec">}}
This version introduces a new theme definition specification, allowing much greater flexibility when defining the Zellij UI appearance - extending to user plugins as well. This specification concentrates on the generic UI components used to make-up the Zellij UI rather than mapping colors. We look forward to seeing new themes created by the community with these capabilities.

For more information, see [the theme documentation](/documentation/themes.html).

Special thanks for [DeaconDesperado](https://github.com/DeaconDesperado) for implementing the specification.

## New (Rust) Plugin APIs
This version adds lots of new capabilities to plugins and exposes them in the built-in Rust SDK. Some highlights:

### Change the `/host` folder
```rust
let new_host_folder = PathBuf::from("/different/path/on/machine");
change_host_folder(new_host_folder);
```

Plugins can now change their mounted `/host` folder at runtime, so that they can access different parts of the user's machine - gated behind the new `FullHdAccess` plugin permission. This ability became possible due to our recent migration to `wasmtime` to manage our WebAssembly/WASI runtime for plugins.

### Change floating pane coordinates
```rust
let coordinates = vec![
    (PaneId::Terminal(1), FloatingPaneCoordinates {
        x: Some(10),
        y: Some(10),
        width: Some(20),
        height: Some(20),
        pinned: Some(true),
    })
];
change_floating_panes_coordinates(coordinates);
```
Plugins can now change the floating pane coordinates of themselves and other panes. The coordinates include the x/y location, their width/height and whether they're pinned or not. Since these can be done in bulk by sending a vector, this opens lots of interesting possibilities for creating dashboard and control flow experiences.

### Stack arbitrary panes
```rust
stack_panes(vec![PaneId::Terminal(1), PaneId::Plugin(1), PaneId::Terminal(2)]);
```
Plugins can now combine existing panes into a stack using their pane ids. Combined with the new `stacked_resize` capabilities described above (also accessible to plugins through the normal resize methods), this can allow plugins to create multiple-select and grouping experiences.

### Read mouse motions
```rust
fn update(event: Event) -> bool {
    match event {
        Event::Mouse(Mouse::Hover(x, y)) => {
            eprintln!("hovering over coordinates: {:?}, {:?}", x, y);
        },
        // ...
    }
    // ...
}
```
Plugins can now read mouse motions when the user hovers over them. Combined with the built-in UI components, this allows creating very pleasant user experiences in the terminal (an example can be seen in the new built-in `about` plugin, accessible with `Ctrl o` + `a`).

## Double/Triple Mouse Click Text Selection in Terminals
{{<figure src="/img/click-boundaries-demo.gif" alt="A video demonstrating the mouse click boundary marking behavior">}}
Since Zellij implements its own mouse selection and copying, many users have noted the lack of ability to double or triple click text in order to mark the word boundaries or canonical line respectively. This version implements this capability for terminal panes. Upcoming in the next version is the ability for plugins to opt-in to text marking with the keyboard/mouse on all or parts of their scrollback.

## Release Notes and Tips on Startup
{{<figure src="/img/zellij-tip-demo.png" alt="A demo of the Zellij tip on startup">}}
Starting this version, on first run Zellij will display the release notes for the current version. On subsequent runs, Zellij will display a random useful usage tip on startup. It's possible to disable both of these behaviors through the config (and in the case of tips, also at runtime through the tips window as specified). More info [here](/documentation/options.html#show_release_nodes) and [here](/documentation/options.html#show_startup_tips).

Both of these can be browsed through the new `about` plugin with `Ctrl o` + `a`.

## Do you like Zellij? ❤️
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

So if the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
