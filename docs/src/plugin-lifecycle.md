# Plugin Lifecycle

Zellij provides the `zellij-tile` crate to plugins in order to better communicate with it over the WASM boundary.

The `zellij-tile` crate provides the `ZellijPlugin` trait:

```rust
pub trait ZellijPlugin {
    fn load(&mut self) {}
    fn update(&mut self, event: Event) -> bool {
        false
    } // return true if it should render
    fn render(&mut self, rows: usize, cols: usize) {}
}
```

## Lifecycle Methods
### load
Will be called when the plugin is loaded, this is a good place to [subscribe](./plugin-api-commands.md) to events that are interesting for this plugin.

### update
Will be called with an [`Event`](./plugin-api-events.md) if the plugin is subscribed to said event. If the plugin returns `true` from this function, Zellij will know it should be rendered and call its `render` function.

### render
Will be called either after an `update` that requested it, or when the plugin otherwise needs to be re-rendered (eg. on startup, or when the plugin is resized). The `rows` and `cols` values represent the "content size" of the plugin (this will not include its surrounding frame if the user has pane frames enabled).

This function is expeted to print to `STDOUT` whatever the plugin would like to render inside its pane. For more information, see [plugin ui rendering](plugin-ui-rendering.md).

## Registering a plugin
After implementing the trait on a struct, we'll need to use the `register_plugin` macro on it:

```rust
struct MyPlugin {
    // ...
}

impl ZellijPlugin for MyPlugin {
    // ...
}

register_plugin!(MyPlugin);
```

Zellij will then instantiate the plugin (using the `Default` implementation) and call it as needed.
