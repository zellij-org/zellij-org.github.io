# Plugin Workers

Plugin workers are a way to get around the fact that wasm/wasi threads are not stable yet. If a plugin has a potentially long operation to perform, it can declare a worker on startup and send and receive messages from it.

## The ZellijWorker trait
`zellij-tile` provides the following interface for workers:

```rust
pub trait ZellijWorker<'de>: Default + Serialize + Deserialize<'de> {
    fn on_message(&mut self, message: String, payload: String) {}
}
```

The `on_message` method will be called when the plugin uses the [`post_message_to`](./plugin-api-commands.md#post_message_to) plugin command with an arbitrary `message` and `payload`. These are specified as `String`s so that plugins can decide on their own method of serialization.

## Registering Workers
To register workers on startup, plugins can use the `register_worker` macro like so:

```rust

pub struct TestWorker {
    // ...
}
impl ZellijWorker for TestWorker {
    // ...
}
register_worker!(
    TestWorker,
    test_worker, // the namespace of the worker, anything before the final _worker will be the worker namespace
    TEST_WORKER // a name for static variable used to store the worker state between invocations
);
```

For more information, please see the `zellij-tile` API documentation.

## Sending messages to workers
When a plugin (or another worker) wishes to send messages to a worker, they use the [`post_message_to`](./plugin-api-commands#post_message_to) plugin command. They should use the worker namespace used when registering the worker, eg. `post_message_to("test", ...)` for the `test_worker` example above.

## Sending messages from workers to plugins
When a worker wishes to send a message to a plugin, they use the [`post_message_to_plugin`](./plugin-api-commands#post_message_to_plugin) command. This message will trigger the plugin's [update](./plugin-api-lifecycle.md#update) method with a [`CustomMessage`](./plugin-api-events.md#CustomMessage) event.
