---
title: "Developing a Zellij plugin using Rust"
images: ["/img/develop-rust-plugin.png"]
description: "A walkthrough of creating a Zellij plugin from start to end"
linktitle: "A walkthrough of creating a Zellij plugin from start to end"
---
{{<video-left-aligned "/video/developing-a-rust-plugin.mp4">}}

This tutorial will walk you through developing a Zellij plugin with rust, using specialized Zellij tools to short-circuit some of the trickier parts.

*The video screencast and the tutorial contain the same content.*

## Prerequisites
* **Basic knowledge of Rust**: the code itself is pretty straightforward, so this is not a must.
* **Rust development tools**: see https://rustup.rs/
* **Zellij 0.41 and above**: see https://github.com/zellij-org/zellij?tab=readme-ov-file#how-do-i-install-it
* **A code editor**: This tutorial works best with a terminal code editor such as `vim`, `helix` or `neovim` but using graphical IDEs such as `VSCode` is also possible.

## What we'll cover
- [Autogenerating a Skeleton Repository (scaffolding)](#autogenerating-a-skeleton-repository-scaffolding)
- [Using the Development Environment](#using-the-development-environment)
- [Step 1: Rendering a UI](#step-1-rendering-a-ui)
- [Step 2: Receiving user input](#step-2-receiving-user-input)
- [Step 3: Parsing and reacting to the Zellij state](#step-3-parsing-and-reacting-to-the-zellij-state)
- [Step 4: Finalizing and distributing the plugin](#step-4-finalizing-and-distributing-the-plugin)
- [Do you like Zellij?](#do-you-like-zellij--)

## What are we building?
{{<figure src="/img/carousel-finished.png" style="max-width 995px;">}}

The plugin we're building is called "Carousel". It will allow users to "mark" panes, adding them to a quick-jump pane-carousel list for easy access and overview.

To follow along with this tutorial, you can clone the [repository](https://github.com/imsnif/carousel). You can check out the specific commits linked to at the beginning of each section. Each such commit represents the state of our plugin at the end of the previous section.

## Autogenerating a Skeleton Repository (scaffolding)

We're going to start by autogenerating a skeleton folder and development environment for our project. We'll do this using [`create-rust-plugin`](https://github.com/zellij-org/create-rust-plugin), which is itself a Zellij plugin.
We can load it directly from the web from inside a Zellij session, like this:

```
zellij plugin -f -- https://github.com/zellij-org/create-rust-plugin/releases/latest/download/create-rust-plugin.wasm
```

After we grant the plugin its requested permissions, we'll get this window:
{{<figure src="/img/create-rust-plugin.png" style="max-width 995px;">}}

Let's give the plugin a unique name (eg. `carousel`) and press `Enter`.

Tip: Generating lots of plugins? You can bind this to a [keybinding](https://zellij.dev/documentation/keybindings.html) shortcut:
```javascript
shared {
    bind "Ctrl y" {
        LaunchOrFocusPlugin "https://github.com/zellij-org/create-rust-plugin/releases/latest/download/create-rust-plugin.wasm" {
            project_dir "/home/aram/code" // TODO: change-me!
            floating true // will open the tool in a new floating pane
            move_to_focused_tab true // will prefer to focus the plugin if it exists rather than opening it, moving it to the focused tab
        }
    }
}
```

## Using the Development Environment
The above step creates the skeleton repository for us and drops us into a development environment for our new plugin. This environment includes another tool [`develop-rust-plugin`](https://github.com/zellij-org/develop-rust-plugin) which will allow us quickly iterate over our plugin and see the changes in real time. Whenever we'd like to compile and reload our plugin, we'll press `Ctrl Shift r` and this tool will compile our plugin with `cargo build` and reload the generated `wasm` file directly in our workspace.
{{<figure src="/img/develop-rust-plugin.png" style="max-width 995px;">}}

Otherwise, we also had our `$EDITOR` opened to the `src/main.rs` file in this repository, which includes the skeleton of our new plugin. Let's press `Ctrl Shift r` once to see what we've got:
{{<figure src="/img/developing-a-plugin-0.png" style="max-width 995px;">}}

Not much here yet! Let's get to work.

## Step 1: Rendering a UI
**COMMIT:** https://github.com/imsnif/carousel/tree/f812eb01c0da32b24d3e4f679556a2ae0f05ae82

Arguably the most important part of creating user-facing tools is rendering a nice user interface. To do this, we're going to use the [`UI Components`](https://zellij.dev/documentation/plugin-ui-rendering#using-the-built-in-ui-components) provided by Zellij.

Let's go to the `render` function in our project skeleton. Currently, it looks like this:
```rust
fn render(&mut self, rows: usize, cols: usize) {
    println!("Hi there! I have {rows} rows and {cols} columns");
}
```

### Rendering simple Text
We'll start by rendering a title:
```rust
fn render(&mut self, rows: usize, cols: usize) {
    let title_text = "CAROUSEL";
    let title = Text::new(title_text).color_range(2, ..);
    print_text_with_coordinates(title, 0, 0, None, None);
}
```
Here we used the `Text` UI component with the `color_range` method. This method accepts a `color_index`, of 0 to 3 (`2` in our case) and a [`Range`](https://doc.rust-lang.org/std/ops/struct.Range.html) (`..` in our case). The color index represents one of four possible text colorings that would fit neatly and still be readable and consistent with the user's theme without us having to think about it too much. The range represents the letter indices which we would like to color in the `Text` string. In our case we elect `..` to color them all.

**Tip:** You can use several calls for `color_range` in the same `Text` element to color it differently, and also use `color_indices` to only color specific non-contiguous indices.

Finally, we use the `print_text_with_coordinates` method, which accepts (in order) the `x` and `y` coordinates of this element within our plugin, and optionally the element's `width` and `height`. We left those last ones empty (`None`) for now.

Now we press `Ctrl Shift r` and get:
{{<figure src="/img/developing-a-plugin-2.png" style="max-width 995px;">}}

### A less trivial Text rendering example
What happens if the user's screen is too small to render all the text we'd like?

Zellij always tells us how large our plugin screen is in the `render` function. Giving us the plugin's `rows` and `cols` count. We can use this to make sure our UI doesn't overflow and get wrapped if the plugin window is smaller than we were planning.

Let's see how this works by rendering the `Help` line:

```rust
fn render(&mut self, rows: usize, cols: usize) {
    // ...
    let help_text_full = "Help: <ENTER> - focus selected, <0-9> - focus index, <↓↑> - navigate, <Del> - delete selected, <ESC> - hide";
    let help_text_short = "<ENTER/0-9> - focus selected/index, <↓↑/ESC> - navigate/hide, <Del> - delete";
    let help = if help_text_full.chars().count() <= cols {
        Text::new(help_text_full)
            .color_range(3, 6..=12)
            .color_range(3, 32..=36)
            .color_range(3, 53..=56)
            .color_range(3, 70..=74)
            .color_range(3, 95..=100)
    } else {
        Text::new(help_text_short)
            .color_range(3, ..=10)
            .color_range(3, 36..=43)
            .color_range(3, 62..=66)
    };
    print_text_with_coordinates(help, 0, rows, None, None);
}
```
Here we have two versions of the `Help` line. A "full" and a "short" one. If the full version is wider than the plugin, we'll render the short one.

Here's how it looks:
{{<figure src="/img/developing-a-plugin-3.png" style="max-width 995px;">}}
{{<figure src="/img/developing-a-plugin-4.png" style="max-width 995px;">}}

### Rendering dynamic content
Finally, let's see how we render dynamic contents and get around some of the "gotcha"s involved.

We're going to render the list of "marked panes", these are the panes the user decided to mark and add to the quick-jump list displayed in this plugin. For each of these panes, we'll render its title and an index shortcut that can be used to quickly jump to it. Since the user should be able to browse through these panes (by pressing the up or down arrows to move the selection), we'll also mark one of these panes as visually selected.

To do this, we're going to add a `marked_panes` attribute to our plugin `State` which will include a `Vec` of `PaneId`s. We'll also include a `selected_index` attribute, indexing the aforementioned `Vec` and letting us know which `PaneId` is selected. We're also going to add a `mock_data` attribute, representing a dictionary of `PaneId` to `String` - mocking the title of the panes. Later on in this tutorial we'll swap the `mock_data` attribute for real data we'll get from Zellij.

```rust
#[derive(Default)]
struct State {
    marked_panes: Vec<PaneId>,
    selected_index: usize,
    mock_data: BTreeMap<PaneId, String>
}

impl State {
    fn render_marked_panes(&self, max_width: usize) -> (Vec<Text>, usize) {
        let mut longest_line_count = 0;
        let mut text_items: Vec<Text> = vec![];
        for (i, pane_id) in self.marked_panes.iter().enumerate() {
            let (item, item_width) = self.render_list_item(pane_id, max_width, i);
            longest_line_count = std::cmp::max(longest_line_count, item_width);
            text_items.push(item);
        }
        if text_items.is_empty() {
            (vec![Text::new("NO ITEMS.").color_range(0, ..)], longest_line_count)
        } else {
            (text_items, longest_line_count)
        }
    }
    fn render_list_item(&self, pane_id: &PaneId, max_width: usize, i: usize) -> (Text, usize) {
        let mut pane_title = self
            .mock_data
            .get(&pane_id)
            .map(|p| p.as_str())
            .unwrap_or("<UNKNOWN>")
            .to_owned();
        let shortcut_len_and_padding = 4;
        let truncation_len = 4;
        if pane_title.chars().count() + truncation_len > max_width.saturating_sub(shortcut_len_and_padding) {
            pane_title.truncate(max_width.saturating_sub(shortcut_len_and_padding + truncation_len));
            pane_title = format!("{}...", pane_title);
        };
        let list_item_text = format!("<{i}> {}", pane_title);
        let mut list_item = Text::new(&list_item_text).color_range(0, ..).color_range(3, ..=3);
        if i == self.selected_index {
            list_item = list_item.selected();
        }
        (list_item, list_item_text.chars().count())
    }
}
```

In the `render_marked_panes` function we're looping through our `marked_panes`, keeping track of their width in `longest_line_count`. We do this so that we can make sure the selection background is the width of the longest line rather than just the current line for a more consistent UI look. If we don't have any `marked_panes`, we render the `NO ITEMS` Text item to indicate this to the user.

In the `render_list_item` method, we get the title of the marked pane from our `mock_data` attribute and then truncate it if it's longer than our UI width. If the list item index squals our `selected_index` attribute, we make sure to mark the `Text` as `selected` using `list_item = list_item.selected()`.

From the `render_marked_panes` method, we make sure to return not only the list of `text_items` to be rendered as a `Vec` but also the width of the longest line so that the rest of the UI can center itself. Putting it all together with our `render` function and adding some more explanation texts to let the user know how to add panes to the list and toggle its visibility, we get:

```rust
fn render(&mut self, rows: usize, cols: usize) {
    let (title, title_width) = self.render_title(cols);
    let (mut explanation_text_lines, explanation_text_width) = self.render_explanation_text(cols);
    let (help, help_text_width) = self.render_help_text(cols);

    let mut lengths = vec![title_width, explanation_text_width, help_text_width];
    lengths.sort();
    let longest_line_count = lengths.last().copied().unwrap_or(0);

    let (mut marked_panes, marked_panes_width) = self.render_marked_panes(longest_line_count, cols);
    let longest_line_count = std::cmp::max(longest_line_count, marked_panes_width);

    let item_count = std::cmp::max(self.marked_panes.iter().count(), 1);
    let base_y = rows.saturating_sub(item_count + 7) / 2;
    let base_x = cols.saturating_sub(longest_line_count) / 2;
    print_text_with_coordinates(title, base_x + longest_line_count.saturating_sub(title_width) / 2, base_y, Some(cols), None);
    for (i, line) in explanation_text_lines.drain(..).enumerate() {
        print_text_with_coordinates(line, base_x, base_y + i + 2, None, None);
    }
    for (i, text_item) in marked_panes.drain(..).enumerate() {
        print_text_with_coordinates(text_item, base_x, base_y + 5 + i, Some(longest_line_count), None);
    }
    print_text_with_coordinates(help, base_x, base_y + item_count + 6, None, None);
}
```

Note how we're keeping track of line lengths throughout the rendering process. We do this in order to later center the whole UI using the `base_x` and `base_y` coordinates. A good practice is to always use `saturating_sub` when calculating coordinates, in case the plugin window is reduced far below the size we expect.

This gives us:
{{<figure src="/img/developing-a-plugin-5.png" style="max-width 995px;">}}

The first item is marked as our selection because our `selected_index` defaults to `0`. In the next session we're going to see how we can give our users control of our plugin and changing this.

## Step 2: Receiving user input
**COMMIT:** https://github.com/imsnif/carousel/tree/42f1ab6135f571e8eec35a404c1bce0759a26dbe

Let's make things more interactive! When a user is focused on a plugin and types something on the keyboard, we can receive this information as [`Event`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/enum.Event.html)s. Specifically a `Key` Event. We're going to use these events to move the selection up and down.

### The `subscribe` function
We use the [`subscribe`](https://docs.rs/zellij-tile/latest/zellij_tile/shim/fn.subscribe.html) function to tell Zellij which events our plugin is interested in. We provide this function with a list of [`EventType`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/enum.EventType.html)s corresponding to the sort of `Event`s we'd like to subscribe. Let's do this on plugin load and subscribe to the `Key` event:

```rust
impl ZellijPlugin for State {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        // ...
        subscribe(&[EventType::Key]);
    }
    // ...
}
```

### Reacting to `Key` events
Once we've subscribed to these events, Zellij will trigger our `update` function every time the user presses a key while focused on our plugin. For each `Key` event, Zellij will provide us the [`KeyWithModifier`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/struct.KeyWithModifier.html) struct so that we can figure our which key was pressed and react to it. Let's take a look at this struct and its associated attributes:

```rust
pub struct KeyWithModifier {
    pub bare_key: BareKey,
    pub key_modifiers: BTreeSet<KeyModifier>,
}

pub enum BareKey {
    PageDown,
    PageUp,
    Left,
    Down,
    Up,
    Right,
    Backspace,
    Char(char),
    Tab,
    Esc,
    // ...
}

pub enum KeyModifier {
    Ctrl,
    Alt,
    Shift,
    Super,
}
```

Each `KeyWithModifier` as a `BareKey` enum (truncated for brevity) and a `KeyModifier` set. So for example, when the user presses `Ctrl Shift a`, the `KeyWithModifier` will be:

```rust
// pseudocode
KeyWithModifier {
    bare_key: BareKey::Char('a'),
    key_modifiers: BTreeSet<{KeyModifier::Ctrl, KeyModifier::Shift}>
}
```

The `KeyWithModifier` struct provides us with useful methods so that we can match against it in a readable way. Let's look at our `update` function now:

```rust
impl ZellijPlugin for State {
    // ...
    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            Event::Key(key) => {
                match key.bare_key {
                    BareKey::Down if key.has_no_modifiers() => {
                        if self.selected_index + 1 < self.marked_panes.len() {
                            self.selected_index += 1;
                            should_render = true;
                        }
                    }
                    BareKey::Up if key.has_no_modifiers() => {
                        if self.selected_index > 0 {
                            self.selected_index -= 1;
                            should_render = true;
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
        should_render
    }
    // ...
}
```

When a user presses a key while focused on our plugin, the `update` method above will be triggered with the `Key` event, providing us the relevant `KeyWithModifier`. We match against the `BareKey`, and if it is `Down` or `Up` and has no modifiers (eg. `Ctrl` or `Shift`) we move the `selected_index` up or down (making sure it's within the bounds of our list).

Another thing to note is the `bool` return value of the `update` function. If we return `true` from this function, Zellij will assume the plugin would like to render itself (i.e. there was a change in the UI) and call the plugin's `render` function (discussed above in the UI section). So we make sure to change the `should_render` bool to `true` if our `selected_index` moved as a result of the user pressing one of the above keys.

But what if we'd like to react to keys the user pressed while to react to keys the user pressed while not focused on our plugin? Our user needs to be able to mark the panes they are focused on using `Ctrl Shift i`, in this case by definition they are not focused on our plugin! Let's look at `pipes` in order to achieve this.

### Communicating with running plugins using Pipes
**COMMIT:** https://github.com/imsnif/carousel/tree/0d5573084207f8bc691f5f6cc3f74d2bb5af3bdb

[Pipes](https://zellij.dev/documentation/plugin-pipes) in Zellij are very similar to pipes on the command line (and indeed can seamlessly interact with them). In this case, we're going to use them to send keypresses to plugins. They are a very versatile entity and the reader is encouraged to read more about them for more creative and powerful uses.

Our generated plugin template includes a `pipe` method, which will be triggered every time messages are piped to our plugin:

```rust
impl ZellijPlugin {
    // ...
    fn pipe (&mut self, pipe_message: PipeMessage) -> bool {
        let mut should_render = false;
        should_render
    }
    // ...
```

Right now, this method doesn't do much. Similar to the `update` method described above, it returns a `bool` value letting Zellij know whether the plugin would like to render itself.

Let's add some debug printing to see how this works:

```rust
impl ZellijPlugin {
    // ...
    fn pipe (&mut self, pipe_message: PipeMessage) -> bool {
        let mut should_render = false;
        eprintln!("Received pipe_message: {:#?}", pipe_message);
        should_render
    }
    // ...
```
By printing to `STDERR` with `eprintln`, we're telling Zellij to place these messages in its log file. The log file location can be found by issuing `zellij setup --check` through the command-line. On my machine it is `/tmp/zellij-1000/zellij-log/zellij.log`, let's tail it in a new Zellij pane with `tail -f /tmp/zellij-1000/zellij-log/zellij.log`. In a different pane, we're going to pipe a message to this plugin through the command line with `zellij pipe -- "hi there!"`

Here's what we see: (truncated for clarity)
```
Received pipe_message: PipeMessage {
    source: Cli(
        "c82fc6e8-064f-4c91-b494-912041339867",
    ),
    name: "f985faa1-43b4-4e64-a52b-ff49329bd9cd",
    payload: Some(
        "hi there!",
    ),
    args: {},
    is_private: false,
}
```

The [`PipeMessage`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/struct.PipeMessage.html) provides us the payload we gave it through the command line (`hi there!`) as well as some metadata regarding the pipe itself. We can see the [`PipeSource`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/enum.PipeSource.html) for example, letting us know that the pipe came from the command line and giving us its ID in case we'd like to perform operations on it such as applying backpressure.

The `PipeMessage` also lets us know that this pipe is not private. This is because pipes are broadcast by default, sent to all running plugins in the session. In order to send a pipe to a specific plugin, we're going to need either its unique ID in our session or the URL and configuration with which it was loaded.

In our case, we'd like the user to pipe information to our plugin when pressing a keybinding rather than through the command line. We can achieve this by having our plugin temporarily bind a key in the user's current session that would pipe information to our plugin. To do this, we're going to need to first discover our plugin's unique [`PaneId`](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/enum.PaneId.html). We do this with the [get_plugin_ids](https://docs.rs/zellij-tile/latest/zellij_tile/shim/fn.get_plugin_ids.html) function on plugin load like so:

```rust
impl ZellijPlugin for State {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        // ...
        let plugin_ids = get_plugin_ids();
        self.own_plugin_id = Some(plugin_ids.plugin_id);
    }
    // ...
}
```

This id is guaranteed not to change for the lifetime of the plugin. Once we have this, we can use it as a destination for our keybind pipe. We bind this key temporarily for the user with the [`reconfigure`](https://docs.rs/zellij-tile/latest/zellij_tile/shim/fn.reconfigure.html) function:

```rust
pub fn bind_key(own_plugin_id: u32) {
    let new_config = format!(
        "
        keybinds {{
            shared {{
                bind \"Ctrl Shift i\" {{
                    MessagePluginId {} {{
                        name \"mark_pane\"
                    }}
                }}
            }}
        }}
        ",
        own_plugin_id,
    );
    reconfigure(new_config, false);
}
```

The `reconfigure` function in the example above sends a new [`Keybindings`](https://zellij.dev/documentation/keybindings.html) configuration to be applied to the current Zellij session. Since we did not clear the previous configuration with [`clear-defaults`](https://zellij.dev/documentation/keybindings-binding#overriding-keys), our keybindings will be applied "on top" of the user's existing keybindings, only overriding them if the user had a previous key bound to the same shortcut.

In this example, we bind `"Ctrl Shift i"` hard-coded, but if we wanted to make the keybinding dynamic, we could also place our own `KeyWithModifier` in the string using its `Display` property to stringify it without us having to do it ourselves. We use the `MessagePluginId` action which pipes a message to the plugin id we received above using the `get_plugin_ids` method. We also give the pipe message a name we can recognize later (`"mark_pane"`). But where do we use this function?

The easiest answer would be in our `load` function, which is triggered whenever the plugin is loaded - but this would unfortunately not be the best course of action. The reason is that in order to reconfigure the user's keybinding, we're going to need to ask for permission and only bind the key once we're sure the permission has been granted. Let's take a look at how we can achieve this:

```rust
impl ZellijPlugin for State {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        // ...
        request_permission(&[PermissionType::Reconfigure]);
        subscribe(&[EventType::Key, EventType::PermissionRequestResult]);
    }
    // ...
}
```

Here in the load function, we added a call to `request_permission`. This function will request permissions for our plugin (`Reconfigure` in this case), prompting the user on plugin load (when we called the function) and returning the response to us as a `PermissionRequestResult` - which we made sure to also subscribe to.

The user will see something like this:
{{<figure src="/img/developing-a-plugin-6.png" style="max-width 995px;">}}

Once they press `y` or `n`, we will receive their response as a `PermissionRequestResult` event and can react to it in our `update` function like this:

```rust
impl ZellijPlugin for State {
    // ...
    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            Event::PermissionRequestResult(permission_status) => {
                match permission_status {
                    PermissionStatus::Granted => {
                        if let Some(own_plugin_id) = self.own_plugin_id {
                            bind_key(own_plugin_id);
                        }
                    }
                    PermissionStatus::Denied => {
                        eprintln!("Permission denied!");
                    }
                }
            }
            // ...
            _ => {}
        }
        should_render
    }
    // ...
}
```

Permissions are cached by the plugin url which the plugin was loaded from. So on the next run, the user will not be prompted for permission if they have already accepted it. We will however always receive the `PermissionRequestResult` after plugin load, meaning it's safe to leave our logic there regardless of whether we already have permission or not.

Now that we've bound our key globally to pipe a message to us, let's adjust our `pipe` function:

```rust
impl ZellijPlugin for State {
    // ...
    fn pipe(&mut self, pipe_message: PipeMessage) -> bool {
        let mut should_render = false;
        if pipe_message.source == PipeSource::Keybind && pipe_message.is_private {
            if pipe_message.name == "mark_pane" {
                eprintln!("The user asked to mark their focused pane!");
            }
        }
        should_render
    }
}
```

Here, we make sure to only react to a pipe message that came from a `Keybind`, is private to us (as opposed to broadcast to all plugins), and has the `mark_pane` message name which we have defined above in the `reconfigure` command. When we get this message, we print a message to the log. Not very interesting, but it's a start! In the next section, we'll see how we can figure out which pane the user is focused on so that we can add it to our list and display it in the UI.

*A note about security*: while in order to message plugins another plugin would need the relevant permission, it's probably a good idea to include a unique identifier (eg. a `uuid`) with pipe messages as an argument and to compare against it when reacting to the pipe message. This is not a must (especially when doing trivial things such as marking a pane) but is good to keep in mind. Pipes are a public interface and should be treated as such.

## Step 3: Parsing and reacting to the Zellij state
**COMMIT:** https://github.com/imsnif/carousel/tree/3792a6eb3b92fa0c3b967a5361a62bea55a59969

As a plugin, given the right permissions, we can find out lots of things about the state of the Zellij workspace: we can get information about [panes](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/struct.PaneManifest.html), [tabs](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/struct.TabInfo.html) and even other [sessions](https://docs.rs/zellij-tile/latest/zellij_tile/prelude/struct.SessionInfo.html). In our case, we need to find out two important pieces of information:

1. Which pane the user is focused on (so that we can mark it when the user presses `Ctrl shift i`)
2. What are the pane titles corresponding to the list of pane ids that we have (so that we can display them on screen rather than just their `PaneId`)

To get this information, we're going to need to request the relevant permission (`ReadApplicationState`) and subscribe to 2 different events: `PaneUpdate` and `TabUpdate`:

```rust
impl ZellijPlugin for State {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        // ...
        request_permission(&[PermissionType::Reconfigure, PermissionType::ReadApplicationState]);
        subscribe(&[
            EventType::Key,
            EventType::PaneUpdate,
            EventType::TabUpdate,
        ]);
    }
    // ...
}
```

After we are granted permissions, we'll start getting these events whenever the information they contain change (and also once on plugin load). Let's see how we can use them to achieve our goals:

```rust
impl ZellijPlugin for State {
    // ...
    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            // ...
            Event::TabUpdate(tab_infos) => {
                self.update_tab_info(tab_infos);
                should_render = true;
            }
            Event::PaneUpdate(pane_manifest) => {
                self.update_latest_pane_manifest(pane_manifest);
                should_render = true;
            }
            _ => {}
        }
        should_render
    }
}
```

One thing to note here is that after each of these events we're setting `should_render` to `true` because they represent a potential UI change. If we wanted, we could be even more exact about this - only setting `should_render` to true if our UI actually changed - but that's out of scope for this tutorial. Let's flesh out the `update_tab_info` and `update_latest_pane_manifest` functions:

```rust
struct State {
    // ...
    focused_pane_id: Option<PaneId>,
    latest_pane_manifest: Option<PaneManifest>,
    active_tab_position_and_floating_panes_visible: Option<(usize, bool)>,
    pane_titles: HashMap<PaneId, String>,
}

impl State {
    pub fn update_tab_info(&mut self, tab_infos: Vec<TabInfo>) {
        for tab in tab_infos {
            if tab.active {
                let floating_panes_are_visible = tab.are_floating_panes_visible;
                self.active_tab_position_and_floating_panes_visible = Some((tab.position, floating_panes_are_visible));
            }
        }
        self.update_panes();
    }
    pub fn update_latest_pane_manifest(&mut self, pane_manifest: PaneManifest) {
        self.latest_pane_manifest = Some(pane_manifest);
        self.update_panes();
    }
    fn update_panes(&mut self) {
        if let Some(pane_manifest) = &self.latest_pane_manifest {
            for (tab_index, panes_in_tab) in &pane_manifest.panes {
                if let Some((active_tab_position, floating_panes_are_visible)) = self.active_tab_position_and_floating_panes_visible.as_ref() {
                    for pane in panes_in_tab {
                        if pane.is_suppressed {
                            // suppressed panes are panes that are administratively hidden and not visible to the user
                            // it is safe to completely ignore them in this context
                            continue;
                        }
                        let pane_id = if pane.is_plugin {
                            PaneId::Plugin(pane.id)
                        } else {
                            PaneId::Terminal(pane.id)
                        };
                        if tab_index == active_tab_position &&
                            pane.is_focused &&
                            pane.is_floating == *floating_panes_are_visible
                        {
                            self.focused_pane_id = Some(pane_id);
                        }
                        self.pane_titles.insert(pane_id, pane.title.to_owned());
                    }
                }
            }
        }
    }
}
```

Here we are answering the questions we asked in the previous section:
1. **Which pane the user is focused on:** We record this in `focused_pane_id`
2. **What are the pane titles corresponding to the list of pane ids that we have:** we record all pane titles in a `HashMap` with their `PaneId` as the key and their title as the value

In order to determine if a pane is focused, we need to check 3 things:
1. Is its own `is_focused` property set to `true`
2. Is its tab's `active` property set to true (a pane may be focused in an unfocused tab)
3. If it is a floating pane, is its tab's `are_floating_panes_visible` property set to `true`. If it is not a floating pane, is its tab's `are_floating_panes_visible` set to `false`.

Now, once we start recording this info we can make our `pipe` function do the right thing!

```rust
impl ZellijPlugin for State {
    // ...
    fn pipe(&mut self, pipe_message: PipeMessage) -> bool {
        let mut should_render = false;
        if pipe_message.source == PipeSource::Keybind && pipe_message.is_private {
            if pipe_message.name == "mark_pane" {
                should_render = self.mark_focused_pane();
            }
        }
        should_render
    }
    fn mark_focused_pane(&mut self) -> bool {
        let mut marked_pane = false;
        if let Some(focused_pane_id) = self.focused_pane_id {
            match self.marked_panes.iter().position(|p| p == &focused_pane_id) {
                Some(existing_pane_id_position) => {
                    // if it's already in the list, remove it
                    self.marked_panes.remove(existing_pane_id_position);
                },
                None => {
                    self.marked_panes.push(focused_pane_id);
                }
            }
            marked_pane = true;
        }
        marked_pane
    }
}
```

Now, the last piece of our plugin is... doing the actual work! Let's react to the user pressing `Enter` and get them to their desired pane:

```rust
impl ZellijPlugin for State {
    // ...
    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            // ...
            Event::Key(key) => {
                match key.bare_key {
                    // ...
                    BareKey::Enter if key.has_no_modifiers() => {
                        if let Some(selected_pane_id) = self.marked_panes.get(self.selected_index) {
                            focus_pane_with_id(*selected_pane_id, true); // true means that if this pane is suppressed, it should reappear as floating
                            hide_self();
                        }
                    }
                    _ =>  {}
                }
            },
            _ => {}
        }
        should_render
    }
}
```

There are a few more pieces to this plugin that are largely repetitions of things we already covered. For example: having he plugin show itself when the user presses a certain key combination through an additional pipe message. If you'd like to learn more, you can take a look at the [source code of the finished plugin](https://github.com/imsnif/carousel).

## Step 4: Finalizing and distributing the plugin
**COMMIT:** https://github.com/imsnif/carousel/tree/aecd0319165202574c44c35b2f5292dacb319c26

Once we have finished iterating over the plugin and decided we're ready to start using it ourselves and publish a first version, we build a release version:
```
cargo build --release
```
This will create a wasm file in the following path: `<OUR_PLUGIN_DIR>/target/wasm32-wasi/release/<OUR_PLUGIN_NAME>.wasm`.

We can load this file into Zellij with the `Plugin Manager` (accessible by default with `Ctrl o` + `p`) by pressing `Ctrl a` and following the on-screen instructions.
We can also load it through the command line with `zellij plugin -- file:/<PATH_TO_OUR_FILE>`.

### Sharing our plugin with others
A good way to distribute our plugin is to publish it as part of some release mechanism in an online code repository. If you're using `GitHub`, here's a GitHub action that will build and publish a release of your plugin every time you `git tag` it with a version number: https://github.com/imsnif/carousel/blob/main/.github/workflows/release.yml

Be sure to change the plugin name in the linked file from `carousel` to your plugin name!

If you create a plugin and would like to share it with the community, you can also make a PR to [awesome-zellij](https://github.com/zellij-org/awesome-zellij).

## Do you like Zellij ❤️ ?
Me too! So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

So if the tool gives you value and you are able, please consider a recurring monthly donation of 5-10$ to help me pay my bills. There are Zellij stickers in it for you! https://github.com/sponsors/imsnif
