---
title: "Zellij for Coding Agents - Every Agent, One Inbox"
description: "Run coding agents side by side in Zellij, see which one needs you across all your sessions, and answer it from the inbox without switching tabs."
layout: agents
faq:
  - q: "Which coding agents does it work with?"
    a: "Any agent that runs in a terminal. Claude Code, Codex CLI, OpenCode, GitHub Copilot CLI, Pi, goose, Qwen Code, Crush and Factory Droid report whether they're working, waiting for you or done, with no setup. Agents that don't report their status yet, like Gemini CLI or Cursor CLI, still show up when they ring the bell or send a desktop notification. [Full list](/documentation/inbox-integrations.html)"
  - q: "Do I need to set anything up?"
    a: "Usually not. Agents that support OSC 7501, a way for programs to report their status, tell Zellij exactly what they're doing as soon as you update them. For everything else, Zellij watches every pane for bells, desktop notifications and shell prompt markers, so long builds and test runs report when they finish or fail too. [Connecting other programs](/documentation/inbox-integrations.html)"
  - q: "Do my agents stop when I close the window?"
    a: "No. Sessions keep running in the background, with every agent still working. Reopen them from the tray icon or the session manager, or attach from any other terminal, even over SSH."
  - q: "Can I check on them from my phone?"
    a: "Yes. The built-in [web client](/documentation/web-client.html) opens your sessions in a browser, including on a phone, so you can answer an agent that's waiting for you while you're away from your desk."
---
