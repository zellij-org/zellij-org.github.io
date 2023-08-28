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
zellij action launch-or-focus-plugin --configuration "some_key=some_value,another_key=1"
```
