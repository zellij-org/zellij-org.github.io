---
title: "About Zellij"
---

Zellij is a terminal workspace. It has the base functionality of a terminal multiplexer (similar to `tmux` or `screen`) but includes many built-in features that would allow users to extend it and create their own personalized environment.

### Split the terminal into different panes and tabs
Like other multiplexers, Zellij allows users to split their terminal into different panes and tabs:

{{<figure src="/img/about-basics.png" class="center">}}

### Layout Engine
Zellij includes a layout engine, allowing users to define a map of panes in a yaml file and load it when they start the app. This way, one can have one's panes laid out just the way one wants them without having to do all the setup work.

{{<figure src="/img/beta-post-layout.png" class="center">}}

For more information, see the [layout documentation](/documentation/layouts.html).

### Extend Zellij with plugins written in any compiled language
Zellij also has some special panes which are not terminals. These panes are called plugins. Zellij comes with some prebuilt plugins such as the [Strider file explorer](https://github.com/zellij-org/zellij/tree/main/default-plugins/strider). Zellij uses Webassembly and WASI in order to load these panes and give them access to the host machine, so they can be written in any compiled language. To learn more, see the [plugin documentation](/documentation/plugins.html)

{{<figure src="/img/beta-post-plugins.png" class="center">}}
