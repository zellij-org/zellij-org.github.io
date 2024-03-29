# Zig

### **Please see the [up-to-date documentation](/documentation) for the most recent features.**

Writing a zellij plugin in Zig should be just as easy as it is in Rust, thanks to [zellzig](https://mzte.de/git/LordMZTE/zellzig).
This guide should walk you through the basics of using it. **Some basic knowledge of Zig is assumed.**

This guide will get you set up with all the tools you need. We'll be using the zellzig example, which is a simple status bar as a starting point.

## Getting Started
First of all, you'll need to install the Zig compiler.
Due to Zig being rather early in development, most of the ecosystem, including zellzig, currently revolves around the master version of the compiler. This means that, to install the compiler, you might have to build it yourself.

If you're on Arch Linux, this should be as simple as installing the `zig-git` AUR package. On other systems, you should check out Zig's [guide on building the compiler](https://github.com/ziglang/zig/wiki/Building-Zig-From-Source).

Along with zig, you'll also need [gyro](https://github.com/mattnite/gyro). Gyro is a package manager for Zig. It is used by zellzig to manage dependencies.

## Creating the project
Now that you've got the necessary tooling up and running, we're ready to actually start coding!

First, create a directory for your plugin, cd into it, and initialize zig and gyro:
```bash
mkdir zellzig_plugin
cd zellzig_plugin
zig init-lib
gyro init
```

Next up, open `gyro.zzz` and add info about your project and the zellzig dependency:
```yaml
pkgs:
  zellzig_plugin:
    version: 0.0.0
    description: "My cool zellzig plugin!"
    license: GPL-3.0 # Your license here
    source_url: "https://git.example.com/your_name/zellzig_plugin"
    root: src/main.zig

deps:
  zellzig:
    git:
      url: "https://mzte.de/git/LordMZTE/zellzig.git"
      ref: master
      root: src/main.zig
```

We'll also need to make some changes on the  `build.zig` build script. Namely,
- set the target to wasm,
- set the system API to wasi,
- switch from a static to a shared libary,
- and register the gyro dependencies.

This is the diff from the default build.zig file:
```diff
const std = @import("std");
+const pkgs = @import("deps.zig").pkgs;

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

-   const lib = b.addStaticLibrary("zellzig_plugin", "src/main.zig");
+   const lib = b.addSharedLibrary("zellzig_plugin", "src/main.zig", .{ .unversioned = {} });
    lib.setBuildMode(mode);
+
+   lib.target.cpu_arch = .wasm32;
+   lib.target.os_tag = .wasi;
+
+   pkgs.addAllTo(lib);
+
    lib.install();

    const main_tests = b.addTest("src/main.zig");
    main_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&main_tests.step);
}
```

Now, you might be asking where this `deps.zig` file is. Well, It'll be generated by gyro in a second.

If you're using git, you should also add a `.gitignore`:
```gitignore
zig-cache/
zig-out/
.gyro
gyro.lock
deps.zig
```

Last but not least, we'll also add a [zellij layout file](./layouts.md) for our plugin. Since we're writing a status bar, we'll create a layout that replaces the default status bar with our bar:
```yaml
---
template:
  direction: Horizontal
  parts:
    - direction: Vertical
      borderless: true
      split_size:
        Fixed: 1
      run:
        plugin:
          location: "zellij:tab-bar"
      
    - direction: Vertical
      plugin: "zig-out/lib/example.wasm"
    
    - direction: Vertical
      borderless: true
      split_size:
        Fixed: 1
      run:
        plugin:
          location: "file:zig-out/lib/zellzig_plugin.wasm"
```

## Writing the plugin
Before we actually get coding, we should check if what we've just created actually is correct. We can test if the default Zig template compiles by running `gyro build`. This should also download all dependencies.

If everything went well, we should also have the plugin file (which won't work just yet) in `zig-out/lib/`.

Now that we got all the preparation out the way, we can finally jump in. Let's open `src/main.zig`!

Zig will have generated some boilerplate in there, but except for the first line, which imports the standard library, we can get rid of everything.

### Registering the plugin

We'll now start by importing zellzig, and saving the import in a variable called `zz`:
```zig
const std = @import("std");
const zz = @import("zellzig");
```

This won't do much on its own, but now we can call zellzig functions.
The first one we should call is one that creates all the exported symbols that zellij will call, alongside some communication handling.
This function actually needs to be called at compile time, as all it does is give the compiler some functions to be exported by the wasm file. Because of this, It goes in a `comptime` block.

```zig
const std = @import("std");
const zz = @import("zellzig");

comptime {
    zz.createPlugin(@This());
}
```

We pass in `@This()`, which is the struct of the current scope.
Since namespaces in zig are just structs, this return our root struct.
`createPlugin` needs this, so it can get access to the functions we'll define next.

There are 3 functions that zellzig calls:
- init
    - called on plugin initialization
- update
    - called on an event
- render
    - called to draw the plugin

### The `init` function
In the `init` function, we should set zellzig's allocator, which it uses for deseralization of zellij's messages.
```zig
var gpa = std.heap.GeneralPurposeAllocator(.{}){};

pub fn init() void {
    zz.allocator = gpa.allocator();
}
```

Here, we create a `GeneralPurposeAllocator`. It's assigned to a global variable, so it's not dropped once `init` returns.
Then, we assign the allocator to `zz.allocator`. Now the allocator is set.

Next, we'll make sure zellij doesnt stay open because of our plugin. To do this, we'll make our plugin unselectable:

```zig
zz.api.setSelectable(false);
```

The last thing we'll put in init is a call to `subscribe`. This tells zellij what events we're interested in:

```zig
zz.api.subscribe(&[_]zz.types.EventType{.ModeUpdate}) catch unreachable;
```

The `subscribe` function takes a slice of `EventType`s we want to receive. Since we're making a status bar, we only care about mode updates, but you can add more if you wish.

This function can return an error, since sending data to zellij might fail. But since we can't recover from it, we'll use `catch unreachable`, so the program crashes if this fails.

Our code should now look like this:
```zig
const std = @import("std");
const zz = @import("zellzig");

comptime {
    zz.createPlugin(@This());
}

var gpa = std.heap.GeneralPurposeAllocator(.{}){};

pub fn init() void {
    zz.allocator = gpa.allocator();
    zz.api.setSelectable(false);
    zz.api.subscribe(&[_]zz.types.EventType{.ModeUpdate}) catch unreachable;
}
```

### The `update` function
This function is responsible for handling the events we've subscribed to. In our case, that's only `ModeUpdate`s.

First, this is what the function looks like:
```zig
pub fn update(ev: zz.Event) void {

}
```

As a parameter, it takes an event. Since we've only subscribed to `ModeUpdate` events, that's the only event we'll get.

Since we want to render the current mode, we need to save it when we receive it in `update`. Thus, we'll create a global variable that holds the current mode, and assign it in `update`.

```zig
var mode: ?zz.types.InputMode = null;

pub fn update(ev: zz.Event) void {
    switch (ev) {
        .ModeUpdate => |mode_info| mode = mode_info.mode,
        else => {},
    }
}
```

We also make mode optional, since we don't know it once the plugin is initalized, but we'll get a mode event right away, so it doesn't really matter.

### The `render` functio
`render` is the last function we need. In it, we display the current mode (which we saved in `mode`, remember?).

```zig
pub fn render(rows: i32, cols: i32) void {
    _ = rows;
    _ = cols;

    if (mode) |m| {
        var out = std.io.getStdOut();
        var writer = out.writer();
        writer.writeAll(@tagName(m)) catch {};
    }
}
```

We assign `rows` and `cols` to `_`, since we don't need them. Next we check if `mode` is set, and if it is, we print it out.

`@tagName` returns the string name of an enum variable.

With the last function in place, our plugin should be all done. This is what the finished code looks like:
```zig
const std = @import("std");
const zz = @import("zellzig");

comptime {
    zz.createPlugin(@This());
}

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
var mode: ?zz.types.InputMode = null;

pub fn init() void {
    zz.allocator = gpa.allocator();
    zz.api.setSelectable(false);
    zz.api.subscribe(&[_]zz.types.EventType{.ModeUpdate}) catch unreachable;
}

pub fn update(ev: zz.Event) void {
    switch (ev) {
        .ModeUpdate => |mode_info| mode = mode_info.mode,
        else => {},
    }
}

pub fn render(rows: i32, cols: i32) void {
    _ = rows;
    _ = cols;

    if (mode) |m| {
        var out = std.io.getStdOut();
        var writer = out.writer();
        writer.writeAll(@tagName(m)) catch {};
    }
}
```

Now, all that's left is to build with `gyro build -Drelease-fast` (you should do a release build, since debug builds tend to be buggy sometimes) and run zellij with our layout file: `zellij --layout-path plugin.yaml`.
