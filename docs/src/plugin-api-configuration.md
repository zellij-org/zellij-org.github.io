# Plugin API - Configuration
Plugins can be configured (have their behavior changed when instantiated) with an arbitrary key/value list.
This configuration is available to plugins in their `load` method. It can be provided through layouts:

```javascript
    pane {
        plugin location="file:/path/to/my/plugin.wasm" {
            some_key "some_value"
            another_key 1
        }
    }
```

Or through the command line:
```
zellij action launch-or-focus-plugin file:/path/to/my/plugin.wasm --configuration "some_key=some_value,another_key=1"
```

## The reserved `instance` key
The `instance` key has a special meaning for [shared plugins](./plugin-lifecycle.md#shared-plugins): all panes that load the same shared plugin with the same `instance` value (or without one) are served by a single plugin instance. Give panes different `instance` values to run separate instances of a shared plugin. Plugins that are not shared receive `instance` like any other key.

The configuration each pane was opened with is available to a shared plugin in the [`Slot`](./plugin-api-types.md#slot) passed to `slot_added`.
