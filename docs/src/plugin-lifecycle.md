# Plugin Lifecycle

Zellij provides the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) crate to plugins to facilitate development.

The `zellij-tile` crate provides the `ZellijPlugin` trait:

```rust
pub trait ZellijPlugin: Default {
    fn load(&mut self, configuration: BTreeMap<String, String>) {}
    fn update(&mut self, event: Event) -> bool {
        false
    }
    fn pipe(&mut self, pipe_message: PipeMessage) -> bool {
        false
    }
    fn render(&mut self, rows: usize, cols: usize) {}
}
```

## Lifecycle Methods
### load
Will be called when the plugin is loaded, with the plugin's [configuration](./plugin-api-configuration.md). This is a good place to [subscribe](./plugin-api-commands.md#subscribe) to events that are interesting for this plugin.

### update
Will be called with an [`Event`](./plugin-api-events.md) if the plugin is subscribed to said event. If the plugin returns `true` from this function, Zellij will know it should be rendered and call its `render` function.

Since events are used for asynchronous communication between Zellij and the plugin, they do not follow
a specific order. This means, that a plugin could receive certain events (like `ModeUpdate`) before the
`PermissionRequestResult` event is received. Therefore the plugin should ensure, that dependencies within
the plugin logic between certain events are handled correctly. An example for waiting for the `PermissionRequestResult`
can be found in [this great plug post](https://blog.nerd.rocks/posts/common-snippets-for-zellij-development/)

Events that happen while a plugin is still loading are kept and delivered once it has loaded. This also works for plugins loaded in the background (eg. through [`load_plugins`](./plugin-loading.md#on-startup)) before any user is attached to the session.

A plugin that is hidden (eg. with [`hide_self`](./plugin-api-commands.md#hide_self)) is not rendered, but keeps receiving the `ModeUpdate`, `TabUpdate`, `PaneUpdate` and `InputReceived` events it is subscribed to.

### pipe
Will be called when a message is sent to the plugin through a [pipe](./plugin-pipes.md) (from the command line, a keybinding or another plugin). A `PipeMessage` whose `payload` is `None` means the pipe has ended. As with `update`, returning `true` renders the plugin.

### render
Will be called either after an `update` or `pipe` that requested it, or when the plugin otherwise needs to be re-rendered (eg. on startup, or when the plugin is resized). The `rows` and `cols` values represent the "content size" of the plugin (this will not include its surrounding frame if the user has pane frames enabled).

This function is expected to print to `STDOUT` whatever the plugin would like to render inside its pane. For more information, see [plugin ui rendering](plugin-ui-rendering.md).

## Registering a plugin
After implementing the trait on a struct, we'll need to use the `register_plugin` macro on it:

```rust
struct MyPlugin {
}

impl ZellijPlugin for MyPlugin {
}

register_plugin!(MyPlugin);
```

Zellij will then instantiate the plugin (using the `Default` implementation) and call it as needed.

## Shared plugins

Normally, every pane that shows a plugin runs its own instance of it. A shared plugin is a plugin where a single instance serves many panes. This saves memory and lets the plugin keep one state for all of them - the built-in `zellij:bars` plugin, which draws the tab bar, the status bar and the compact bar of every tab, is a shared plugin.

Each pane (or background load) that uses a shared plugin is a **slot**. All slots that load the same plugin location with the same value for the [`instance` configuration key](./plugin-api-configuration.md#the-reserved-instance-key) (or without one) belong to the same instance. The instance is loaded with the configuration of its first slot, and is unloaded when its last slot is closed.

A shared plugin implements the `ZellijSharedPlugin` trait and is registered with `register_shared_plugin!`:

```rust
pub trait ZellijSharedPlugin: Default {
    fn load(&mut self, configuration: BTreeMap<String, String>) {}
    fn slot_added(&mut self, slot: Slot) {}
    fn slot_removed(&mut self, slot_id: SlotId) {}
    fn client_connected(&mut self, client_id: ClientId) {}
    fn client_disconnected(&mut self, client_id: ClientId) {}
    fn update(&mut self, event: Event, context: EventContext) -> RenderResponse {
        RenderResponse::Nothing
    }
    fn pipe(&mut self, pipe_message: PipeMessage, context: EventContext) -> RenderResponse {
        RenderResponse::Nothing
    }
    fn render(&mut self, rows: usize, cols: usize, slot_id: SlotId, client_id: ClientId) {}
}
```

| Method | Called when |
|--------|-------------|
| `load` | The instance is loaded, once |
| `slot_added` | A pane or background load starts using this instance. The [`Slot`](./plugin-api-types.md#slot) carries its id, kind and configuration |
| `slot_removed` | A slot's pane is closed |
| `client_connected` / `client_disconnected` | A user attaches to or leaves the session |
| `update` | An event the instance is subscribed to arrives. `context.slot_id` is set for events tied to one pane (`Key`, `Mouse`, `PastedText`, `Visible`, `PermissionRequestResult` and `PluginConfigurationChanged`), and `context.client_id` when the user the event came from is known |
| `pipe` | A pipe message arrives, with the same kind of context |
| `render` | One slot needs to be drawn for one user. It is called once per slot and user that can see it |

Instead of a `bool`, `update` and `pipe` return a [`RenderResponse`](./plugin-api-types.md#slot): `Nothing`, `All` (every slot for every user), `Client(client_id)` (every slot as seen by that user) or `Slots(slot_ids)`.

Commands that act on "this plugin's pane" (eg. [`set_selectable`](./plugin-api-commands.md#set_selectable), [`hide_self`](./plugin-api-commands.md#hide_self), [`set_self_collapsed`](./plugin-api-commands.md#set_self_collapsed) or [`set_live_view`](./plugin-api-commands.md#set_live_view)) only work inside `render` and `slot_added`, where Zellij knows which slot is meant. Anywhere else they fail with an error; use the [slot commands](./plugin-api-commands.md#shared-plugin-slots) (eg. `set_selectable_slot(slot_id, ...)`) instead.

```rust
use std::collections::BTreeMap;
use zellij_tile::prelude::*;

#[derive(Default)]
struct State {
    slots: BTreeMap<SlotId, Slot>,
    modes: BTreeMap<ClientId, InputMode>,
}

register_shared_plugin!(State);

impl ZellijSharedPlugin for State {
    fn load(&mut self, _configuration: BTreeMap<String, String>) {
        request_permission(&[PermissionType::ReadApplicationState]);
        subscribe(&[EventType::ModeUpdate]);
    }
    fn slot_added(&mut self, slot: Slot) {
        set_selectable(false);
        self.slots.insert(slot.id, slot);
    }
    fn slot_removed(&mut self, slot_id: SlotId) {
        self.slots.remove(&slot_id);
    }
    fn update(&mut self, event: Event, context: EventContext) -> RenderResponse {
        match event {
            Event::ModeUpdate(mode_info) => match context.client_id {
                Some(client_id) => {
                    self.modes.insert(client_id, mode_info.mode);
                    RenderResponse::Client(client_id)
                },
                None => RenderResponse::Nothing,
            },
            _ => RenderResponse::Nothing,
        }
    }
    fn render(&mut self, _rows: usize, _cols: usize, slot_id: SlotId, client_id: ClientId) {
        let label = self
            .slots
            .get(&slot_id)
            .and_then(|slot| slot.configuration.get("label").cloned())
            .unwrap_or_default();
        println!("{} {:?}", label, self.modes.get(&client_id));
    }
}
```
