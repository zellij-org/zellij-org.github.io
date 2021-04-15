---
title: "About Zellij"
---

Zellij is a terminal workspace. It has the base functionality of a terminal multiplexer (similar to `tmux` or `screen`) but includes many built-in features that would allow you to extend it and create your own personalized environment.

#### Split the terminal into different panes and tabs
Like other multiplexers, Zellij allows users to split their terminal into panes of different sizes:

// TBD: diagram

Zellij also allows users to have different tabs

// TBD: diagram

#### Layout Engine
Zellij includes a layout engine, allowing users to define a map of panes and load it when they start the app. This way, one can have one's panes laid out just the way one wants them without having to do all the setup work.

For more information: /* TBD: link to layout documentation */

#### Extend Zellij with plugins written in any compiled language
Zellij also has some special panes which are not terminals. These panes are called plugins. Zellij comes with some prebuilt plugins such as the Strider file explorer /* TBD link */. Zellij uses Webassembly and WASI in order to load these panes and give them access to the host machine, so they can be written in any compiled language. To learn more, see: /* TBD link to plugin docs */
