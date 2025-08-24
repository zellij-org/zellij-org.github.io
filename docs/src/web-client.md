# Web Client
Zellij can also work in the browser, allowing users to share existing sessions and start new ones. This is useful for easy and secure remote access, and can also allow users to forgo their terminal emulator entirely if they wish.

This is done through a built-in webserver (turned off by default) that provides built-in authentication and session-management.

For a detailed walk through, see the [screencast](/tutorials/web-client/).

## How to start?
The web server can be started from the `share` plugin (accessible by default with `Ctrl o` + `s`):

![Web client preview](/img/web-client-preview.png)

The web server can also be started from the CLI with:
```
$ zellij web
```

## How to log-in?
For privacy and security, the Zellij web server requires users be authenticated before they can log in. To do this, one must create a "login-token". These tokens can be created from the "share" plugin (accessible by default with `Ctrl o` + `s`) or from the CLI:

```
zellij web --create-token
```

**IMPORTANT:** These tokens are hashed in a local database and so will only be displayed once. They cannot be retrieved, only revoked (either from the CLI or from the `share` plugin).

## HTTPS?
The Zellij web server can work with a user provided SSL certificate to serve terminal sessions over an encrypted HTTPS connection. This is a hard requirement if listening on any interface that is not `127.0.0.1` but is very much recommended even when working on `127.0.0.1`. (for more detailed instructions on how to do this, take a look at the [screencast](/tutorials/web-client/)).

To set up an SSL certificate in the Zellij [configuration](./configuration):

```javascript
web_server_cert "/path/to/my/certs/localhost+3.pem" // certificate
web_server_key "/path/to/my/certs/localhost+3-key.pem" // private key
```

## URL scheme

By default, once started, the web server will listen on `http://127.0.0.1:8082`. When connecting to this address, users will be greeted with the `welcome-screen`, allowing them to start a new session, attach to an existing one or resurrect an exited one.

The web server works with a URL scheme, such that following the root URL with a session-name (eg. `http://127.0.0.1:8082/my-amazing-session`), will:
1. Start a new session by this name if it does not exist
2. Attach to this session if it exists
3. [Resurrect](./session-resurrection.md) this session if it has exited

This means that if we bookmark this URL, we will be able to drop back in to exactly where we left off with this particular session - even if we've since shut down our machine completely.

## Configuration
To configure the webserver, in the Zellij [configuration](./configuration.md):

```javascript
web_server true // always start the web server on Zellij startup (default: false)
web_server_ip "0.0.0.0" // the IP to listen on, 0.0.0.0 is all (default: 127.0.0.1)
web_server_port 443 // the port to listen on (default: 8082)
web_server_cert "/path/to/my/certs/localhost+3.pem" // SSL certificate
web_server_key "/path/to/my/certs/localhost+3-key.pem" // SSL private key
enforce_https_on_localhost true // whether to enforce an https certificate being present also when listening on localhost (default: false)
```

It's also possible to configure the browser terminal itself:

```javascript
web_client {
  font "Iosevka Term" // default is "monospace" - deferring this decision to the browser/os
  cursor_blink true // default is false
  cursor_style "block" // possibilities: "block", "bar", "underline"
  cursor_inactive_style "outline" // possibilities: "outline", "block", "bar", "underline"
  mac_option_is_meta false // default is true
  theme {
    // NOTE: this is the theme of the terminal web client which is separate from Zellij's theme
    //
    // all values are optional and should be in the form of "r g b" (eg. 10 20 30)
    background 10 20 30
    foreground 10 20 30
    black 10 20 30
    blue 10 20 30
    bright_black 10 20 30
    bright_blue 10 20 30
    bright_cyan 10 20 30
    bright_green 10 20 30
    bright_magenta 10 20 30
    bright_red 10 20 30
    bright_white 10 20 30
    bright_yellow 10 20 30
    cursor 10 20 30
    cursor_accent 10 20 30
    cyan 10 20 30
    green 10 20 30
    magenta 10 20 30
    red 10 20 30
    white 10 20 30
    yellow 10 20 30
    selection_background 10 20 30
    selection_foreground 10 20 30
    selection_inactive_background 10 20 30
  }
}
```

## Security Considerations and Recommendations
The Zellij web server is security and privacy conscious, enforcing HTTPS if accessed over the network and authentication at all times. It is however recommended to place the server behind a reverse proxy (such as `nginx`) if exposing it to an untrusted network (eg. the Internet). This is because the web server does not provide its own rate-limiting to mitigate denial of service and similar attacks.

In its security model, the web-server assumes that **authenticated users are trusted**. This is because the server can only serve terminal sessions of a single particular user on a single particular machine. This user by-definition has access to start/stop the web server itself, as well as access sensitive information on the machine by nature of this being a terminal session.

The web server only saves session-tokens (not the actual log-in tokens) in the browser as cookies, preventing javascript access to them and instead relying on http headers to authenticate them on the server side. Whenever an authentication token is revoked, all of its associated session tokens are revoked as well.

## This feature can optionally be disabled at compile-time
For those who are averse to this feature (even when it's disabled - which is the default), Zellij can be compiled completely without this feature or its dependencies by removing the `web_server_capability` compile-time flag. For convenience, Zellij also provides an additional pre-built binary compiled without this flag called `zellij-no-web`.
