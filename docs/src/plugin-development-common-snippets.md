# Common Snippets

This page describes some common tasks and snippets that can be used for the plugin development. Snippets are written in Rust,
but the concepts should be transferable to other languages as well. All examples are based on the [rust-plugin-example](https://github.com/zellij-org/rust-plugin-example).

## Non selectable plugins with permissions

If a plugin (like a statusbar) should be non selectable, [zellij-tile](https://docs.rs/zellij-tile/latest/zellij_tile/)
provides the function `set_selectable()`. When this function is directly called on plugin
initialization, a user won't be able to grant plugin permissions since the plugin cannot be
selected. Therefore the plugin should call `set_selectable(false)` after receiving the `PermissionRequestResult`.

The following code demonstrates the feature. Notice, that the plugin must subscribe to the
`PermissionRequestResult` to receive it in the `load()` function. Then the event must be handled
in the `update()` function.

```rust
impl ZellijPlugin for State {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        request_permission(&[
            PermissionType::ReadApplicationState,
        ]);

        subscribe(&[
            EventType::ModeUpdate,
            EventType::PermissionRequestResult,
        ]);
    }

    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;

        match event {
            // ...
            Event::PermissionRequestResult(result) => {
                set_selectable(false);
            }
            // ...
        }

        should_render
    }
}
```

## Queuing events until PermissionsRequestResult is received

Hence Zellij communicates via events with the plugin, a plugin needs to ensure that dependencies between these
events, that are relevant for the logic of the plugin, are handled correctly. For example, when a plugin is started
a second time, it will receive a few events (like `ModeUpdate`) before the `PermissionRequestResult` event is received.
If a plugin calls a function as soon as the `ModeUpdate` event is received, that requires permissions, the function
call would fail. Therefore the plugin needs to hold back events until the `PermissionRequestResult` is received.

The following code demonstrates how events can be stored into a queue, until the `PermissionRequestResult` is received.
A `Vec<Event>` is used in the `State` struct for storing the events. Event handling is extracted into a separate function,
such that it can be called in several places in the `update()` function. If `PermissionRequestResult` is not received,
events will be pushed into the vector. As soon as the `PermissionRequestResult` is received, the vector will be emptied
and all events will be processed sequentially.

```rust
struct State {
    pending_events: Vec<Event>,
    got_permissions: bool,
}

impl ZellijPlugin for State {
    // ...

    fn update(&mut self, event: Event) -> bool {
        if let Event::PermissionRequestResult(PermissionStatus::Granted) = event {
            self.got_permissions = true;

            // iterate through all cached events, if the PermissionRequestResult is
            // received and permissions are granted with it
            while !self.pending_events.is_empty() {
                let ev = self.pending_events.pop();

                self.handle_event(ev.unwrap());
            }
        }

        if !self.got_permissions {
            // store events in a vector until permissions were granted
            self.pending_events.push(event);

            return false;
        }

        // handle events normally, if permissions were granted
        self.handle_event(event)
    }

    // ...
}

impl State {
    // this function was previously the update() function
    fn handle_event(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            Event::ModeUpdate(mouse_info) => {
                should_render = true;
            }
        }
        should_render
    }
}
```

## Advanced logging & Tracing

Tracing is a form of logging, which could help to trace calls through certain functions and files of the code.
There is a `tracing` and a `tracing-subscriber`, which can be utilized to implement tracing within Zellij plugins.
First add these two crates with `cargo add tracing tracing-subscriber`.

Next add a function, that initializes the tracing.

```rust
fn init_tracing() {
    use std::fs::File;
    use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

    let file = File::create(".zellij_plugin.log");
    let file = match file {
        Ok(file) => file,
        Err(error) => panic!("Error: {:?}", error),
    };
    let debug_log = tracing_subscriber::fmt::layer().with_writer(Arc::new(file));

    tracing_subscriber::registry().with(debug_log).init();

    tracing::info!("tracing initialized");
}
```

Call this function at the beginning of the `load()` function of your plugin. It will initialize the tracing crate and
configure it, such that it will write into a log file, where the plugin is started. Then you can use the tracing crate, similarly to
the log crate.

```rust
    tracing::debug!("tracing initialized");
    tracing::info!("tracing initialized");
    tracing::warning!("tracing initialized");
    tracing::error!("tracing initialized");
```

Additionally, functions can be instrumented with tracing. For more details, please visit the documentation of the tracing
crate at [https://docs.rs/tracing/latest/tracing/](https://docs.rs/tracing/latest/tracing/).

```rust
#[tracing::instrument]
fn my_function() {
    // ...
    tracing::debug!("some tracing output");
}
```
