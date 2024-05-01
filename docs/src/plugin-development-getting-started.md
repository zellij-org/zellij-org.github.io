# Getting started

This guide will help you get started with developing a plugin for Zellij in Rust. It will guide you through
setting up your development environment, creating a new plugin, and playing around to understand how
Zellij plugins work.

## Requirements

Make sure you have the following programs installed on your system:

- Rust with the wasm32-wasi target *or* rustup
- Zellij

If you have installed rustup, you can install the wasm32-wasi target by running:

```sh
rustup target add wasm32-wasi
```

## Plugin template

The easiest way to get started is to check out the [rust-plugin-example](https://github.com/zellij-org/rust-plugin-example/tree/main).
It provides a good starting point with some basic functionality, which helps to explore the plugin
development process. Navigate to the path you want to store the plugin and run:

```sh
git clone https://github.com/zellij-org/rust-plugin-example
```

After cloning the repository, navigate to the `rust-plugin-example` directory and build the plugin for the first time:

```sh
cd ./rust-plugin-example
cargo build
```

This will create a `target` directory with the compiled plugin. It can be found
at `target/wasm32-wasi/debug/rust-plugin-example.wasm`. To execute the plugin, use the following command:

```sh
zellij action start-or-reload-plugin file:target/wasm32-wasi/debug/rust-plugin-example.wasm
```

Now a new pane should be created, that asks for permissions. Navigate to the new pane and press `y` to grant the permissions.
Afterwards it should display some details about the current session, like the count of columns and rows, or the current tabs.

When developing the plugin, simply rebuild it with the `cargo build` command and then run the `zellij action start-or-reload-plugin` command again to reload it.

## Exploring the plugin

The example plugin consists mainly of the `src/main.rs` file, which contains the logic for it. In the file there is a struct `State`
that implements the `ZellijPlugin` trait. This trait is required for Zellij to load and run the plugin. A detailed documentation of
the trait can be found in [Plugin Lifecycle](./plugin-lifecycle.md).

To further play around and understand the plugin, we could in the first step implement some log output, which gives us insights into
the running code. Logs are written to `STDERR` and captured by Zellij. Zellij will print the in its own log file. This one can be found
on Linux at `/tmp/zellij-<UID>/zellij-log/zellij.log` or in macOS somewhere in `/var/folders/.../zellij-log/zellij.log`.

Now let's add the following lines to the code.

```diff
    fn update(&mut self, event: Event) -> bool {
        let mut should_render = false;
        match event {
            Event::ModeUpdate(mode_info) => {
+               eprintln!("Mode update");
                let mode = format!("{:?}", mode_info.mode);
                let count = self.mode_log.entry(mode).or_insert(0);
                *count += 1;
                should_render = true;
            }
            Event::TabUpdate(tab_info) => {
+               eprintln!("Tab update");
                self.tabs = tab_info.iter().map(|t| t.name.clone()).collect();
                should_render = true;
            }
            Event::Key(key) => {
+               eprintln!("Key");
                if let Key::Char('n') = key {
                    self.test_runs += 1;
                    open_command_pane_floating(CommandToRun {
                        path: "cargo".into(),
                        args: vec!["test".to_owned()],
                        cwd: None,
                    });
                }
            }
            _ => (),
        };
        should_render
    }
```

When the plugin is now recompiled and loaded, we should see the log output in the Zellij log file.
This approach can be used to easily debug and understand the plugin logic. However, it is not recommended to use this
logging in a production plugin, since you normally don't read them. For a more advanced approach, please
read the tracing section in [Common Snippets](./plugin-development-common-snippets.md).

## Further steps

After playing around with the example plugin, you can start developing your own plugin. For a complete API reference,
please refer to [https://docs.rs/zellij-tile/latest/zellij_tile/](https://docs.rs/zellij-tile/latest/zellij_tile/).
